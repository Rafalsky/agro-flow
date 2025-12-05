import { Module } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ShiftsController],
    providers: [ShiftsService, PrismaService],
    exports: [ShiftsService],
})
export class ShiftsModule { }
