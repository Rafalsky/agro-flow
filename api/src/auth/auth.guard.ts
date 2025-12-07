import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const request = ctx.switchToHttp().getRequest();
        const token = request.cookies?.['auth_token'];

        if (!token) {
            // If we want to allow guests for some routes, we could check for public decorators here
            // But for now, secure by default or explicit checks in controllers.
            // This generic guard assumes protection unless stated otherwise, or used specifically.
            // For now, let's just populate the user if token exists, or fail if used as @UseGuards(AuthGuard)
            return false; // Fail if no token
        }

        const user = await this.authService.validateToken(token);
        if (!user) {
            return false;
        }

        request.user = user;
        return true;
    }
}
