import { Module } from '@nestjs/common';
import { CyclesService } from './cycles.service';
import { CyclesController } from './cycles.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [CyclesController],
    providers: [CyclesService, PrismaService],
    exports: [CyclesService],
})
export class CyclesModule { }
