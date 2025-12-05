import { Controller, Get, Query, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

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
}
