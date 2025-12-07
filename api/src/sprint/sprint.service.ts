import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TicketType, TicketStatus, ShiftStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';

@Injectable()
export class SprintService {
    constructor(private prisma: PrismaService) { }

    async generateSprint(startDate: string, endDate: string): Promise<any> {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestException('Invalid date format');
        }

        // 1. Fetch Cycles
        const cycles = await this.prisma.cycleDefinition.findMany({ where: { isActive: true } });

        // 2. Iterate days
        let current = new Date(start);
        const ticketsToCreate: Prisma.TicketCreateManyInput[] = [];

        while (current <= end) {
            const dayOfWeek = current.getDay();
            const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;

            const dayCycles = cycles.filter(c => c.dayOfWeek === isoDay);

            for (const cycle of dayCycles) {
                const workingShifts = await this.prisma.shiftAssignment.findMany({
                    where: {
                        date: current, // Prisma should handle Date object to DateTime comparison if exact
                        timeSlot: cycle.timeSlot,
                        status: ShiftStatus.WORKING
                    }
                });

                let assigneeId: string | null = null;
                if (workingShifts.length === 1) {
                    assigneeId = workingShifts[0].workerId;
                }

                ticketsToCreate.push({
                    type: TicketType.CYCLE_INSTANCE,
                    title: cycle.title,
                    description: cycle.description,
                    area: cycle.area,
                    plannedDate: new Date(current),
                    timeSlot: cycle.timeSlot,
                    storyPoints: cycle.storyPoints,
                    checklist: cycle.checklist ? JSON.parse(JSON.stringify(cycle.checklist)) : undefined,
                    data: cycle.data ? JSON.parse(JSON.stringify(cycle.data)) : undefined,
                    sourceCycleId: cycle.id,
                    assigneeId,
                    status: TicketStatus.TODO,
                    version: 1
                });
            }

            current.setDate(current.getDate() + 1);
        }

        if (ticketsToCreate.length > 0) {
            await this.prisma.ticket.createMany({
                data: ticketsToCreate
            });
        }

        return { generated: ticketsToCreate.length };
    }
}
