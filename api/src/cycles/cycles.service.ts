import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, CycleDefinition } from '@prisma/client';

@Injectable()
export class CyclesService {
    constructor(private prisma: PrismaService) { }

    create(data: Prisma.CycleDefinitionCreateInput): Promise<CycleDefinition> {
        return this.prisma.cycleDefinition.create({ data });
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
