import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { createModelMock } from '../../test/utils/create-model-mock';

describe('UsersService', () => {
    let service: UsersService;
    const modelRes = new User();
    let model = createModelMock(modelRes);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: model,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        model = module.get(getModelToken(User.name)) as any;
    });

    describe('create user', function () {
        it('error: invalid email', async () => {
            await expect(
                service.create({
                    email: 'email',
                    password: '123',
                }),
            ).rejects.toThrow('APP: Invalid email');
        });

        it('error: existing user', async () => {
            await expect(
                service.create({
                    email: 'email@mail.com',
                    password: '123',
                }),
            ).rejects.toThrow('APP: User already registered');
        });
    });
});
