import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestModule } from '../../test/utils/create-test-module';
import { UsersService } from '../users/users.service';
import * as request from 'supertest';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AppError } from '../shared/models/app-error';
import { EmailService } from '../email/email.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { JwtAuthGuardMock } from '../shared/guards/jwt-auth.guard.mock';

describe('AuthController', () => {
    let app: INestApplication;
    let server: any;
    const userServiceMock = {
        create: jest.fn().mockResolvedValue({ email: 'test' }),
        confirmEmail: jest.fn(),
    };
    const authServiceMock = {
        login: jest.fn().mockResolvedValue('token'),
        generateToken: jest.fn().mockResolvedValue('token'),
    };
    const emailServiceMock = { emailConfirmation: jest.fn() };
    const jwdGuard = JwtAuthGuardMock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: UsersService, useValue: userServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: EmailService, useValue: emailServiceMock },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(jwdGuard)
            .compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
    });

    describe('register user', () => {
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

    describe('login user', () => {
        it(`successfully`, () => {
            authServiceMock.login.mockResolvedValueOnce('token generated');
            return request(server)
                .post('/auth/email/login')
                .send({
                    email: 'my@mail.com',
                    password: '12345678',
                } as LoginDto)
                .expect(HttpStatus.OK);
        });

        it(`with unknown user`, () => {
            authServiceMock.login.mockRejectedValueOnce(new AppError('App: Unknown user'));
            return request(server)
                .post('/auth/email/login')
                .send({
                    email: 'my@mail.com',
                    password: '12345678',
                } as LoginDto)
                .expect(HttpStatus.NOT_FOUND)
                .expect((res) => {
                    expect(res.body.message).toContain('App: Unknown user');
                });
        });

        it(`with invalid password`, () => {
            authServiceMock.login.mockRejectedValueOnce(new AppError('App: Invalid password'));
            return request(server)
                .post('/auth/email/login')
                .send({
                    email: 'my@mail.com',
                    password: '12345678',
                } as LoginDto)
                .expect(HttpStatus.UNAUTHORIZED)
                .expect((res) => {
                    expect(res.body.message).toContain('App: Invalid password');
                });
        });

        it(`with unknown app error`, () => {
            authServiceMock.login.mockRejectedValueOnce(new AppError('App: Unknown error'));
            return request(server)
                .post('/auth/email/login')
                .send({
                    email: 'my@mail.com',
                    password: '12345678',
                } as LoginDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('App: Unknown error');
                });
        });

        it(`with error email not confirmed`, () => {
            authServiceMock.login.mockRejectedValueOnce(new AppError('App: Email not verified'));
            return request(server)
                .post('/auth/email/login')
                .send({
                    email: 'my@mail.com',
                    password: '12345678',
                } as LoginDto)
                .expect(HttpStatus.UNAUTHORIZED)
                .expect((res) => {
                    expect(res.body.message).toContain('App: Email not verified');
                });
        });

        it(`with unknown internal server error`, () => {
            authServiceMock.login.mockRejectedValueOnce(new Error('Server error'));
            return request(server)
                .post('/auth/email/login')
                .send({
                    email: 'my@mail.com',
                    password: '12345678',
                } as LoginDto)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .expect((res) => {
                    expect(res.body.message).toContain('Server error');
                });
        });

        it(`with error wrong values`, () => {
            return request(server)
                .post('/auth/email/login')
                .send({} as LoginDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('email should not be empty');
                    expect(res.body.message).toContain('email must be an email');
                    expect(res.body.message).toContain('email must be a string');
                    expect(res.body.message).toContain('password must be a string');
                    expect(res.body.message).toContain('password should not be empty');
                });
        });
    });

    describe('confirm email', () => {
        it(`successfully`, () => {
            jwdGuard.canActivate.mockImplementationOnce((context) => {
                const req = context.switchToHttp().getRequest();
                req.user = { id: '123', email: 'test@email.com', emailConfirmed: false };
                return true;
            });

            return request(server).post('/auth/email/confirm').send().expect(HttpStatus.OK);
        });

        it(`with error unauthorized`, () => {
            jwdGuard.canActivate.mockReturnValueOnce(false);
            return request(server).post('/auth/email/confirm').send().expect(HttpStatus.FORBIDDEN);
        });
    });
});
