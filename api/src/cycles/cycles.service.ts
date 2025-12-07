import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, CycleDefinition } from '@prisma/client';

@Injectable()
export class CyclesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.CycleDefinitionCreateInput): Promise<CycleDefinition> {
        const cycle = await this.prisma.cycleDefinition.create({ data });

        // Conditional logic: Add to board if conditions are met
        const now = new Date();
        const currentHour = now.getHours();

        // Only proceed if before 14:00
        if (currentHour < 14) {
            try {
                // Get current sprint (or create if doesn't exist)
                const monday = this.getMonday(now);
                const sprint = await this.prisma.sprint.findUnique({ where: { startDate: monday } });

                if (!sprint) {
                    // Sprint doesn't exist yet, will be created on first board access
                    // We could create it here, but lazy loading is the design
                    console.log('No current sprint exists yet, cycle will appear when sprint is generated');
                    return cycle;
                }

                // Calculate the target date for this cycle within the current sprint
                const targetDate = this.getDateForDayOfWeek(cycle.dayOfWeek, monday);

                // Check conditions
                const isToday = this.isSameDay(targetDate, now);
                const isFuture = targetDate > now;
                const isTodayEvening = isToday && cycle.timeSlot === 'EVENING';
                const isTodayMorning = isToday && cycle.timeSlot === 'MORNING';

                // Rule: Add if (today evening OR future) AND NOT (yesterday OR today morning)
                if ((isFuture || isTodayEvening) && !isTodayMorning) {
                    // Create ticket from cycle
                    await this.prisma.ticket.create({
                        data: {
                            type: 'CYCLE_INSTANCE',
                            title: cycle.title,
                            description: cycle.description,
                            area: cycle.area,
                            plannedDate: targetDate,
                            timeSlot: cycle.timeSlot,
                            status: 'TODO',
                            storyPoints: cycle.storyPoints,
                            checklist: cycle.checklist ?? undefined,
                            data: cycle.data ?? undefined,
                            sourceCycleId: cycle.id,
                            version: 1,
                            assigneeId: null
                        }
                    });
                    console.log(`Added cycle "${cycle.title}" to current sprint for ${targetDate.toISOString().split('T')[0]}`);
                }
            } catch (error) {
                console.error('Failed to add cycle to board:', error);
                // Don't fail the cycle creation if board addition fails
            }
        }

        return cycle;
    }

    private getMonday(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    private getDateForDayOfWeek(dayOfWeek: number, monday: Date): Date {
        const offset = (dayOfWeek === 0 ? 7 : dayOfWeek) - 1;
        const targetDate = new Date(monday);
        targetDate.setDate(monday.getDate() + offset);
        targetDate.setHours(0, 0, 0, 0);
        return targetDate;
    }

    private isSameDay(date1: Date, date2: Date): boolean {
        return date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0];
    }

    findAll(): Promise<CycleDefinition[]> {
        return this.prisma.cycleDefinition.findMany({ where: { isActive: true } });
    }

    findOne(id: string): Promise<CycleDefinition | null> {
        return this.prisma.cycleDefinition.findUnique({ where: { id } });
    }

    update(id: string, data: Prisma.CycleDefinitionUpdateInput): Promise<CycleDefinition> {
        return this.prisma.cycleDefinition.update({ where: { id }, data });
    }

    remove(id: string): Promise<CycleDefinition> {
        return this.prisma.cycleDefinition.update({ where: { id }, data: { isActive: false } });
    }
}
