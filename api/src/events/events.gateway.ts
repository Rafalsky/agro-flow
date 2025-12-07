import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Logger } from '@nestjs/common';
import * as cookie from 'cookie';

@WebSocketGateway({
    cors: {
        origin: true,
        credentials: true,
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger('EventsGateway');

    constructor(private readonly authService: AuthService) { }

    async handleConnection(client: Socket) {
        try {
            // Parse cookies from handshake headers
            const rawCookies = client.handshake.headers.cookie;
            if (!rawCookies) {
                throw new Error('No cookies');
            }

            const parsedCookies = cookie.parse(rawCookies);
            const token = parsedCookies['auth_token'];

            if (!token) {
                throw new Error('No auth token');
            }

            const user = await this.authService.validateToken(token);
            if (!user) {
                throw new Error('Invalid token');
            }

            // Join rooms based on role
            if (user.role === 'ZOOTECHNICIAN' || user.role === 'STAKEHOLDER_READONLY') {
                client.join('board');
            }
            if (user.role === 'WORKER') {
                client.join(`worker_${user.id}`);
            }

            // Attach user to socket for future use
            (client as any).user = user;

            this.logger.log(`Client connected: ${client.id} (${user.displayName})`);
        } catch (e: any) {
            this.logger.warn(`Connection rejected: ${e.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    emitTicketUpdate(ticket: any) {
        // Board always gets updates
        this.server.to('board').emit('ticket.updated', ticket);

        // Worker gets update if assigned
        if (ticket.assigneeId) {
            this.server.to(`worker_${ticket.assigneeId}`).emit('ticket.updated', ticket);
        }
    }

    emitTicketCreated(ticket: any) {
        this.server.to('board').emit('ticket.created', ticket);
    }
}
