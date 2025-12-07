import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, ShiftAssignment } from '@prisma/client';

@Injectable()
export class ShiftsService {
    constructor(private prisma: PrismaService) { }

    // Bulk upsert logic using transaction
    async upsertShifts(shifts: Prisma.ShiftAssignmentCreateInput[]): Promise<void> {
        await this.prisma.$transaction(
            shifts.map((shift) => {
                // We need to handle the relation connection (connect: { id: ... }) manually or simplified
                // The DTO coming in usually has workerId as string.
                // Prisma CreateInput vs UncheckedCreateInput handling.
                // Assuming we receive Unchecked inputs or we map them.

                // Simplified upsert based on composite unique constraint
                const uniqueKey = {
                    workerId_date_timeSlot: {
                        workerId: shift.worker.connect?.id || '', // bit hacky if using strict types, better to use UncheckedInput in controller
                        date: new Date(shift.date),
                        timeSlot: shift.timeSlot
                    }
                };

                // However, Prisma client types are strict. Let's use raw inputs or proper types.
                // For simplicity in this demo, let's assume we delete collisions or use upsert.
                // Since `upsert` requires a unique where input, and we have one (@@unique([workerId, date, timeSlot])).

                // This is tricky with strictly typed inputs without DTO definitions.
                // We'll trust the caller to send correct structure matching what Prisma expects for logic below.
                // But to be safe, let's just use createMany or specific updates? 
                // Best approach for "Set shifts": Delete existing for range + Create new, OR Upsert one by one.

                // Let's implement Upsert one by one.
                return this.prisma.shiftAssignment.upsert({
                    where: {
                        workerId_date_timeSlot: {
                            workerId: shift.worker?.connect?.id || '',
                            date: typeof shift.date === 'string' ? new Date(shift.date) : shift.date as Date,
                            timeSlot: shift.timeSlot
                        }
                    },
                    update: {
                        status: shift.status
                    },
                    create: shift
                });
            })
        );
    }

    async findAll(start: Date, end: Date): Promise<ShiftAssignment[]> {
        return this.prisma.shiftAssignment.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end
                }
            },
            include: { worker: true }
        });
    }
}
