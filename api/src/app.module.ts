import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { CyclesModule } from './cycles/cycles.module';
import { ShiftsModule } from './shifts/shifts.module';
import { SprintModule } from './sprint/sprint.module';

@Module({
  imports: [AuthModule, TicketsModule, CyclesModule, ShiftsModule, SprintModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
