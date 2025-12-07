import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentAuth } from '../auth/current-auth.decorator';
import type { Prisma, User } from '@prisma/client';

@Controller('tickets/:ticketId/comments')
@UseGuards(AuthGuard)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    create(
        @Param('ticketId') ticketId: string,
        @Body('content') content: string,
        @CurrentAuth() user: User
    ) {
        return this.commentsService.create({
            content,
            ticket: { connect: { id: ticketId } },
            author: { connect: { id: user.id } }
        });
    }

    @Get()
    findAll(@Param('ticketId') ticketId: string) {
        return this.commentsService.findAllByTicket(ticketId);
    }
}
