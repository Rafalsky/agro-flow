import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, AuthToken, UserRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async validateToken(token: string): Promise<User | null> {
        const authToken = await this.prisma.authToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!authToken || authToken.isRevoked || authToken.expiresAt < new Date()) {
            return null;
        }

        // Rolling expiration (simple update of lastSeenAt, rigorous expiration update optional)
        await this.prisma.authToken.update({
            where: { token },
            data: { lastSeenAt: new Date() }
        });

        return authToken.user;
    }

    // Used by Activation Link flow
    async activateUser(activationToken: string): Promise<string> {
        const tokenRecord = await this.prisma.activationToken.findUnique({
            where: { token: activationToken },
        });

        if (!tokenRecord || tokenRecord.isRevoked || tokenRecord.expiresAt < new Date() || tokenRecord.usedAt) {
            throw new UnauthorizedException('Invalid or expired activation token');
        }

        // Mark used
        await this.prisma.activationToken.update({
            where: { token: activationToken },
            data: { usedAt: new Date() },
        });

        // Create session cookie token
        const cookieToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 14); // 14 days

        await this.prisma.authToken.create({
            data: {
                token: cookieToken,
                userId: tokenRecord.userId,
                expiresAt,
            },
        });

        return cookieToken;
    }

    // Used by Stakeholder Magic Link flow (Permanent)
    async validateMagicLink(magicToken: string): Promise<string> {
        const linkRecord = await this.prisma.magicLink.findUnique({
            where: { id: magicToken },
        });

        if (!linkRecord || !linkRecord.isActive) {
            throw new UnauthorizedException('Invalid or inactive magic link');
        }

        // Create session cookie token
        const cookieToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 14); // 14 days

        await this.prisma.authToken.create({
            data: {
                token: cookieToken,
                userId: linkRecord.userId,
                expiresAt,
            },
        });

        return cookieToken;
    }
}
