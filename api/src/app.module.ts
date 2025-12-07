import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { CyclesModule } from './cycles/cycles.module';
import { ShiftsModule } from './shifts/shifts.module';
import { SprintModule } from './sprint/sprint.module';

import { EventsModule } from './events/events.module';

@Module({
  imports: [AuthModule, TicketsModule, CyclesModule, ShiftsModule, SprintModule, EventsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
