import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [SprintController],
    providers: [SprintService, PrismaService],
})
export class SprintModule { }
