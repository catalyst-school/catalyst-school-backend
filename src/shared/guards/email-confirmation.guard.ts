import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../users/entities/user.schema';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!(request.user as User)?.emailConfirmed) {
            throw new UnauthorizedException('Confirm your email first');
        }

        return true;
    }
}
