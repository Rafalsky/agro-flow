import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CyclesService } from './cycles.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import type { Prisma } from '@prisma/client';

@Controller('cycles')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ZOOTECHNICIAN)
export class CyclesController {
    constructor(private readonly cyclesService: CyclesService) { }

    @Post()
    create(@Body() createCycleDto: Prisma.CycleDefinitionCreateInput) {
        return this.cyclesService.create(createCycleDto);
    }

    @Get()
    findAll() {
        return this.cyclesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cyclesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCycleDto: Prisma.CycleDefinitionUpdateInput) {
        return this.cyclesService.update(id, updateCycleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cyclesService.remove(id);
    }
}
