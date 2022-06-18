import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createServiceMock } from '../../test/utils/create-service-mock';
import { createTestModule } from '../../test/utils/create-test-module';
import { UsersService } from '../users/users.service';
import * as request from 'supertest';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let app: INestApplication;
    let server: any;
    const serviceMock = createServiceMock({});

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: UsersService, useValue: serviceMock },
                { provide: AuthService, useValue: createServiceMock(null) },
            ],
        }).compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
    });

    describe('create user', () => {
        it(`successfully`, () => {
            return request(server)
                .post('/auth/email/register')
                .send({
                    email: 'my@mail.com',
                    password: '12345678',
                } as CreateUserDto)
                .expect(HttpStatus.CREATED);
        });

        it(`with error wrong values`, () => {
            return request(server)
                .post('/auth/email/register')
                .send({} as CreateUserDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('email must be an email');
                    expect(res.body.message).toContain('email must be a string');
                    expect(res.body.message).toContain('email should not be empty');
                    expect(res.body.message).toContain('password must be a string');
                    expect(res.body.message).toContain('password should not be empty');
                });
        });
    });
});
