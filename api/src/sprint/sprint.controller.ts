import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('sprint')
@UseGuards(AuthGuard, RolesGuard)
export class SprintController {
    constructor(private readonly sprintService: SprintService) { }

    @Post('generate')
    @Roles(UserRole.ZOOTECHNICIAN)
    generate(@Body() body: { start: string, end: string }) {
        if (!body.start || !body.end) throw new BadRequestException('Start and End required');
        return this.sprintService.generateSprint(body.start, body.end);
    }
}
