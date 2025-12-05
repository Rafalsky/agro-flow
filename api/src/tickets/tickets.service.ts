import { Injectable, BadRequestException, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Ticket, TicketStatus, User, UserRole, Prisma } from '@prisma/client';

@Injectable()
export class TicketsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.TicketCreateInput, creator: User): Promise<Ticket> {
        if (creator.role !== UserRole.ZOOTECHNICIAN) {
            throw new ForbiddenException('Only Zootechnician can create tickets');
        }

        // Log creation event? Optional for creation, but good for history
        return this.prisma.$transaction(async (tx) => {
            const ticket = await tx.ticket.create({ data });
            await tx.taskEvent.create({
                data: {
                    ticketId: ticket.id,
                    type: 'created',
                    details: { createdBy: creator.id },
                }
            });
            return ticket;
        });
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

        return this.prisma.$transaction(async (tx) => {
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

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.ticket.update({
                where: { id: ticketId },
                data: {
                    status: TicketStatus.WORKER_DONE,
                    data: data ? data : undefined, // Update data if provided
                    version: { increment: 1 }
                }
            });

            await tx.taskEvent.create({
                data: {
                    ticketId,
                    workerId,
                    type: 'worker_done',
                    details: data
                }
            });

            return updated;
        });
    }
}
