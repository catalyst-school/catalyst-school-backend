import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/entities/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createModelMock } from '../../test/utils/create-model-mock';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService = { sign: jest.fn() };
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
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get(JwtService);
        userModel = module.get(getModelToken(User.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return jwt token on login', async () => {
        const email = 'test@mail.com';
        await service.login({ email, password: 'test' });
        expect(jwtService.sign).toHaveBeenCalledWith({ id: user._id });
    });

    it('error: user not found', async () => {
        userModel.findOne().exec.mockResolvedValue(null);
        const email = 'test@mail.com';
        await expect(service.login({ email, password: 'test' })).rejects.toThrow(
            'App: Unknown user',
        );
    });

    it('error: invalid password', async () => {
        const email = 'test@mail.com';
        await expect(service.login({ email, password: 'wrong password' })).rejects.toThrow(
            'App: Invalid password',
        );
    });
});
