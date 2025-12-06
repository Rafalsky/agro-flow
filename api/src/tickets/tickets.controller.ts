import { Controller, Get, Post, Body, Patch, Param, UseGuards, UnauthorizedException, Query, ParseIntPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { Roles } from '../auth/roles.decorator';
import type { User, Prisma } from '@prisma/client';
import { UserRole } from '@prisma/client';

@Controller('tickets')
@UseGuards(AuthGuard, RolesGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @Roles(UserRole.ZOOTECHNICIAN)
    create(@Body() createTicketDto: Prisma.TicketCreateInput, @CurrentAuth() user: User) {
        return this.ticketsService.create(createTicketDto, user);
    }

    @Get()
    findAll(@Query('date') date?: string, @CurrentAuth() user?: User) {
        // Basic filter implementation, can be expanded
        const where: Prisma.TicketWhereInput = {};
        if (date) {
            // Simple date string match for now, ideally range
            where.plannedDate = new Date(date);
        }
        return this.ticketsService.findAll(where);
    }

    @Get('board')
    @Roles(UserRole.ZOOTECHNICIAN)
    getBoard(@Query('date') date: string) {
        const targetDate = date ? new Date(date) : new Date();
        return this.ticketsService.getBoard(targetDate);
    }

    @Get('me/tasks')
    @Roles(UserRole.WORKER)
    getMyTasks(@CurrentAuth() user: User) {
        if (!user) throw new UnauthorizedException();
        // Default to today
        const today = new Date();
        // Normalize time if needed, but for now just pass Date object
        return this.ticketsService.getWorkerTasks(user.id, today);
    }

    @Patch(':id/start')
    @Roles(UserRole.WORKER)
    start(@Param('id') id: string, @Body('clientVersion', ParseIntPipe) clientVersion: number, @CurrentAuth() user: User) {
        if (!user) throw new UnauthorizedException();
        return this.ticketsService.startTask(id, user.id, clientVersion);
    }

    @Patch(':id/finish')
    @Roles(UserRole.WORKER)
    finish(@Param('id') id: string, @Body('clientVersion', ParseIntPipe) clientVersion: number, @Body('data') data: any, @CurrentAuth() user: User) {
        if (!user) throw new UnauthorizedException();
        return this.ticketsService.finishTask(id, user.id, clientVersion, data);
    }
}
