import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/entities/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createModelMock } from '../../test/utils/create-model-mock';
import { EmailService } from '../email/email.service';
import { EmailServiceMock } from '../email/email.service.mock';
import { JwtServiceMock } from '../../test/mocks/jwt.serivce.mock';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService = JwtServiceMock;
    const user = { _id: 'test_id', password: '' };
    let userModel = createModelMock(user);

    beforeAll(async () => {
        user.password = await bcrypt.hash('test', 10);
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: userModel,
                },
                {
                    provide: JwtService,
                    useValue: jwtService,
                },
                {
                    provide: EmailService,
                    useValue: EmailServiceMock,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get(JwtService);
        userModel = module.get(getModelToken(User.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('should return jwt token', async () => {
            const email = 'test@mail.com';
            userModel.findOne().exec.mockResolvedValueOnce({ ...user, emailConfirmed: true });
            await service.login({ email, password: 'test' });
            expect(jwtService.sign).toHaveBeenCalledWith({ id: user._id });
        });

        it('error: user not found', async () => {
            userModel.findOne().exec.mockResolvedValueOnce(null);
            const email = 'test@mail.com';
            await expect(service.login({ email, password: 'test' })).rejects.toThrow(
                'App: Unknown user',
            );
        });

        it('error: email not confirmed', async () => {
            userModel.findOne().exec.mockResolvedValueOnce({ ...user, emailConfirmed: false });
            const email = 'test@mail.com';
            await expect(service.login({ email, password: 'test' })).rejects.toThrow(
                'App: Email not verified',
            );
        });

        it('error: invalid password', async () => {
            const email = 'test@mail.com';
            userModel.findOne().exec.mockResolvedValueOnce({ ...user, emailConfirmed: true });
            await expect(service.login({ email, password: 'wrong password' })).rejects.toThrow(
                'App: Invalid password',
            );
        });
    });
});
