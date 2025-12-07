import { Controller, Get, Post, Body, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import type { Prisma } from '@prisma/client';

@Controller('shifts')
@UseGuards(AuthGuard, RolesGuard)
export class ShiftsController {
    constructor(private readonly shiftsService: ShiftsService) { }

    @Post('bulk')
    @Roles(UserRole.ZOOTECHNICIAN)
    async upsertShifts(@Body() shifts: any[]) { // Using any for simplicity in DTO mapping
        // Map 'any' to Prisma input structure
        const mappedShifts: Prisma.ShiftAssignmentCreateInput[] = shifts.map(s => ({
            date: new Date(s.date),
            timeSlot: s.timeSlot,
            status: s.status,
            worker: { connect: { id: s.workerId } }
        }));

        await this.shiftsService.upsertShifts(mappedShifts);
        return { success: true };
    }

    @Get()
    findAll(@Query('start') start: string, @Query('end') end: string) {
        if (!start || !end) throw new BadRequestException('Start and End dates required');
        return this.shiftsService.findAll(new Date(start), new Date(end));
    }
}
