import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { EmailServiceMock } from '../email/email.service.mock';
import { JwtServiceMock } from '../../test/mocks/jwt.serivce.mock';
import { UsersService } from '../users/users.service';
import { UserServiceMock } from '../users/user.service.mock';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService = JwtServiceMock;
    let emailService = EmailServiceMock;
    let userService = UserServiceMock;
    const user = { _id: 'test_id', password: '', email: 'test@mail.com' };

    beforeAll(async () => {
        user.password = await bcrypt.hash('test', 10);
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: jwtService,
                },
                {
                    provide: EmailService,
                    useValue: emailService,
                },
                {
                    provide: UsersService,
                    useValue: userService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get(JwtService);
        emailService = module.get(EmailService);
        userService = module.get(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('should return jwt token', async () => {
            const email = 'test@mail.com';
            userService.findByEmail.mockResolvedValueOnce({ ...user, emailConfirmed: true });
            await service.login({ email, password: 'test' });
            expect(jwtService.sign).toHaveBeenCalledWith({ id: user._id });
        });

        it('error: user not found', async () => {
            userService.findByEmail.mockResolvedValueOnce(null);
            const email = 'test@mail.com';
            await expect(service.login({ email, password: 'test' })).rejects.toThrow(
                'App: Unknown user',
            );
        });

        it('error: email not confirmed', async () => {
            userService.findByEmail.mockResolvedValueOnce({ ...user, emailConfirmed: false });
            const email = 'test@mail.com';
            await expect(service.login({ email, password: 'test' })).rejects.toThrow(
                'App: Email not verified',
            );
        });

        it('error: invalid password', async () => {
            const email = 'test@mail.com';
            userService.findByEmail.mockResolvedValueOnce({ ...user, emailConfirmed: true });
            await expect(service.login({ email, password: 'wrong password' })).rejects.toThrow(
                'App: Invalid password',
            );
        });
    });

    describe('forgot password', () => {
        it('should send email', async () => {
            const email = 'some@mail.com'; // same email as mocked user in user service
            await service.forgotPassword({ email });
            expect(emailService.forgotPassword).toHaveBeenCalledWith(email, 'token');
        });

        it('error unknown user', async () => {
            const email = 'test@mail.com';
            userService.findByEmail.mockResolvedValueOnce(null);
            await expect(service.forgotPassword({ email })).rejects.toThrow('App: Unknown user');
        });
    });

    describe('reset password', () => {
        it('should update password', async () => {
            const userId = '123'; // same id as mocked in user service
            await service.resetPassword(userId, { password: 'NewPassword' });
            expect(userService.updatePassword).toHaveBeenCalled();
        });

        it('error unknown user', async () => {
            const userId = '123';
            userService.findById.mockResolvedValueOnce(null);
            await expect(
                service.resetPassword(userId, { password: 'NewPassword' }),
            ).rejects.toThrow('App: Unknown user');
        });
    });
});
