import { Injectable, BadRequestException, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Ticket, TicketStatus, User, UserRole, Prisma } from '@prisma/client';

import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class TicketsService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway
    ) { }

    async create(data: Prisma.TicketCreateInput, creator: User): Promise<Ticket> {
        if (creator.role !== UserRole.ZOOTECHNICIAN) {
            throw new ForbiddenException('Only Zootechnician can create tickets');
        }

        // Log creation event? Optional for creation, but good for history
        const result = await this.prisma.$transaction(async (tx) => {
            const ticketData = {
                ...data,
                plannedDate: new Date(data.plannedDate as string) // Ensure Date object
            };
            const ticket = await tx.ticket.create({ data: ticketData });
            await tx.taskEvent.create({
                data: {
                    ticketId: ticket.id,
                    type: 'created',
                    details: { createdBy: creator.id },
                }
            });
            return ticket;
        });

        this.eventsGateway.emitTicketCreated(result);
        return result;
    }

    async findAll(where?: Prisma.TicketWhereInput): Promise<Ticket[]> {
        return this.prisma.ticket.findMany({
            where,
            orderBy: { plannedDate: 'asc' },
            include: { assignee: true }
        });
    }

    async findOne(id: string): Promise<Ticket | null> {
        return this.prisma.ticket.findUnique({ where: { id }, include: { assignee: true } });
    }

    private normalizeDate(date: Date): Date {
        const d = new Date(date);
        d.setUTCHours(0, 0, 0, 0);
        return d;
    }

    private getMonday(d: Date): Date {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        date.setHours(0, 0, 0, 0);
        return new Date(date); // return new instance
    }

    private async ensureSprint(date: Date): Promise<void> {
        const monday = this.getMonday(date);

        // 1. Check if sprint exists
        const sprint = await this.prisma.sprint.findUnique({
            where: { startDate: monday }
        });

        if (sprint) return;

        // 2. Generate Sprint
        await this.generateSprint(monday);
    }

    private async generateSprint(monday: Date): Promise<void> {
        // Calculate Sunday
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        // Fetch Cycles
        const cycles = await this.prisma.cycleDefinition.findMany({
            where: { isActive: true }
        });

        const newTickets: Prisma.TicketCreateManyInput[] = [];

        cycles.forEach(cycle => {
            // Calculate target date for this cycle instance
            // cycle.dayOfWeek: 0(Sun) or 1(Mon)-6(Sat). 
            // We need 1=Mon...0=Sun logic relative to Monday.
            // Offset from Monday:
            // 1 (Mon) -> 0
            // 2 (Tue) -> 1
            // ...
            // 0 (Sun) -> 6
            const cycleDay = cycle.dayOfWeek;
            const offset = (cycleDay === 0 ? 7 : cycleDay) - 1;

            const targetDate = new Date(monday);
            targetDate.setDate(monday.getDate() + offset);

            // Should created specific time? 
            // plannedDate is @db.Date, so time acts as midnight.
            // But we should normalize.
            // targetDate is already based on normalized Monday.

            newTickets.push({
                type: 'CYCLE_INSTANCE', // TicketType.CYCLE_INSTANCE
                title: cycle.title,
                description: cycle.description,
                area: cycle.area,
                plannedDate: targetDate,
                timeSlot: cycle.timeSlot,
                status: 'TODO', // TicketStatus.TODO
                storyPoints: cycle.storyPoints,
                checklist: cycle.checklist ?? undefined,
                data: cycle.data ?? undefined,
                sourceCycleId: cycle.id,
                version: 1,
                assigneeId: null // Goes to unassigned by default
            });
        });

        // Transaction: Create Sprint + Tickets
        await this.prisma.$transaction([
            this.prisma.sprint.create({
                data: {
                    startDate: monday,
                    endDate: sunday
                }
            }),
            this.prisma.ticket.createMany({
                data: newTickets
            })
        ]);

        // Emit event? Maybe not needed for lazy gen, user will refresh or see it.
    }

    async getBoard(date: Date): Promise<Ticket[]> {
        const d = this.normalizeDate(date);

        // Ensure sprint exists for this WEEK
        await this.ensureSprint(d);

        return this.prisma.ticket.findMany({
            where: {
                plannedDate: d
            },
            include: { assignee: true },
            orderBy: { timeSlot: 'asc' }
        });
    }

    async getWorkerTasks(workerId: string, date: Date): Promise<Ticket[]> {
        const d = this.normalizeDate(date);
        return this.prisma.ticket.findMany({
            where: {
                assigneeId: workerId,
                plannedDate: d,
            },
            include: {
                assignee: true
            },
            orderBy: { timeSlot: 'asc' }
        });
    }

    // Worker Flow: Start Task
    async startTask(ticketId: string, workerId: string, clientVersion: number): Promise<Ticket> {
        const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) throw new NotFoundException('Ticket not found');

        if (ticket.assigneeId && ticket.assigneeId !== workerId) {
            throw new ForbiddenException('Ticket assigned to another worker');
        }

        if (ticket.version !== clientVersion) {
            throw new ConflictException(`Version mismatch. Server: ${ticket.version}, Client: ${clientVersion}`);
        }

        const result = await this.prisma.$transaction(async (tx) => {
            // 1. Pause any other IN_PROGRESS ticket for this worker
            const activeTickets = await tx.ticket.findMany({
                where: {
                    assigneeId: workerId,
                    status: TicketStatus.IN_PROGRESS,
                    id: { not: ticketId }
                }
            });

            for (const active of activeTickets) {
                await tx.ticket.update({
                    where: { id: active.id },
                    data: {
                        status: TicketStatus.PAUSED,
                        version: { increment: 1 }
                    }
                });
                await tx.taskEvent.create({
                    data: {
                        ticketId: active.id,
                        workerId,
                        type: 'auto_paused',
                        details: { reason: 'started_another_task', newTicketId: ticketId }
                    }
                });
            }

            // 2. Start current ticket
            const updated = await tx.ticket.update({
                where: { id: ticketId },
                data: {
                    status: TicketStatus.IN_PROGRESS,
                    assigneeId: workerId, // Auto-assign if unassigned
                    version: { increment: 1 }
                }
            });

            await tx.taskEvent.create({
                data: {
                    ticketId,
                    workerId,
                    type: 'started'
                }
            });

            return updated;
        });

        this.eventsGateway.emitTicketUpdate(result);
        return result;
    }

    // Worker Flow: Finish Task
    async finishTask(ticketId: string, workerId: string, clientVersion: number, data?: any): Promise<Ticket> {
        const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) throw new NotFoundException();

        if (ticket.assigneeId !== workerId) {
            throw new ForbiddenException('Not assigned to this task');
        }

        if (ticket.version !== clientVersion) {
            throw new ConflictException('Version mismatch');
        }

        // Allow finish only if IN_PROGRESS? Or allow from PAUSED too?
        // Usually only from IN_PROGRESS, but strictness can vary. Let's assume implied IN_PROGRESS or PAUSED.

        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.ticket.update({
                where: { id: ticketId },
                data: {
                    status: TicketStatus.WORKER_DONE,
                    version: { increment: 1 }
                }
            });

            await tx.taskEvent.create({
                data: {
                    ticketId,
                    workerId,
                    type: 'finished',
                    details: data // Pass optional data
                }
            });
            return updated;
        });

        this.eventsGateway.emitTicketUpdate(result);
        return result;
    }

    async update(id: string, data: Prisma.TicketUpdateInput, version: number): Promise<Ticket> {
        const ticket = await this.prisma.ticket.findUnique({ where: { id } });
        if (!ticket) throw new NotFoundException();

        if (ticket.version !== version) {
            throw new ConflictException(`Version mismatch. Server: ${ticket.version}, Client: ${version}`);
        }

        // Filter out version from data if passed, as we handle it manually
        const { version: _v, ...updateData } = data as any;

        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.ticket.update({
                where: { id },
                data: {
                    ...updateData,
                    version: { increment: 1 }
                }
            });

            await tx.taskEvent.create({
                data: {
                    ticketId: id,
                    type: 'updated',
                    details: updateData
                }
            });

            return updated;
        });

        this.eventsGateway.emitTicketUpdate(result);
        return result;
    }
}
