import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Comment, Prisma } from '@prisma/client';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class CommentsService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway
    ) { }

    async create(data: Prisma.CommentCreateInput): Promise<Comment> {
        const comment = await this.prisma.comment.create({
            data,
            include: { author: true }
        });

        // Emit realtime event
        this.eventsGateway.server.to('board').emit('comment.created', comment);

        return comment;
    }

    async findAllByTicket(ticketId: string): Promise<Comment[]> {
        return this.prisma.comment.findMany({
            where: { ticketId },
            include: { author: true },
            orderBy: { createdAt: 'asc' }
        });
    }
}
