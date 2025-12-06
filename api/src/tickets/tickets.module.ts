import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [AuthModule, EventsModule],
    controllers: [TicketsController],
    providers: [TicketsService, PrismaService],
    exports: [TicketsService],
})
export class TicketsModule { }
