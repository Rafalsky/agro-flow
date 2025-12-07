import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [AuthModule, EventsModule],
    controllers: [CommentsController],
    providers: [CommentsService, PrismaService],
    exports: [CommentsService],
})
export class CommentsModule { }
