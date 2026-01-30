import { Controller, Get, Query, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { CurrentAuth } from './current-auth.decorator';
import type { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('activate')
    async activate(@Query('token') token: string, @Res() res: any) {
        if (!token) {
            throw new UnauthorizedException('Token required');
        }
        try {
            const cookieToken = await this.authService.activateUser(token);

            // Set cookie
            res.cookie('auth_token', cookieToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
                path: '/'
            });

            return res.redirect('/'); // Redirect to frontend app
        } catch (e) {
            throw new UnauthorizedException('Activation failed');
        }
    }

    // TEMPORARY DEBUG ENDPOINT - REMOVE IN PRODUCTION
    @Get('debug/check-token')
    async debugCheckToken(@Query('token') token: string) {
        if (!token) {
            return { error: 'No token provided' };
        }

        const tokenRecord = await this.authService['prisma'].activationToken.findUnique({
            where: { token },
            select: {
                token: true,
                userId: true,
                expiresAt: true,
                usedAt: true,
                isRevoked: true,
                createdAt: true,
            }
        });

        if (!tokenRecord) {
            return { exists: false, message: 'Token not found in database' };
        }

        const now = new Date();
        return {
            exists: true,
            tokenPreview: token.substring(0, 16) + '...',
            userId: tokenRecord.userId,
            expiresAt: tokenRecord.expiresAt,
            isExpired: tokenRecord.expiresAt < now,
            usedAt: tokenRecord.usedAt,
            isUsed: !!tokenRecord.usedAt,
            isRevoked: tokenRecord.isRevoked,
            createdAt: tokenRecord.createdAt,
            isValid: !tokenRecord.isRevoked && !tokenRecord.usedAt && tokenRecord.expiresAt > now
        };
    }

    @Get('magic')
    async magic(@Query('token') token: string, @Res() res: any) {
        if (!token) {
            throw new UnauthorizedException('Token required');
        }
        try {
            const cookieToken = await this.authService.validateMagicLink(token);

            // Set cookie
            res.cookie('auth_token', cookieToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
                path: '/'
            });

            return res.redirect('/');
        } catch (e) {
            throw new UnauthorizedException('Login failed');
        }
    }

    @Get('me')
    @UseGuards(AuthGuard)
    me(@CurrentAuth() user: User) {
        return user;
    }
}
