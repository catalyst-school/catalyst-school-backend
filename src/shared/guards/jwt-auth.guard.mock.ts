import { ExecutionContext } from '@nestjs/common';
import fn = jest.fn;

export const JwtAuthGuardMock = {
    canActivate: fn().mockImplementation((context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = { id: '234', email: 'test@email.com', emailConfirmed: false };
        return true;
    }),
};
