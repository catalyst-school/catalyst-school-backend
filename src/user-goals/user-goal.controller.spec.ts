import { HttpStatus, INestApplication } from '@nestjs/common';
import { createServiceMock } from '../../test/utils/create-service-mock';
import { Test, TestingModule } from '@nestjs/testing';
import { createTestModule } from '../../test/utils/create-test-module';
import { UserGoalController } from './user-goal.contoller';
import { UserGoalService } from './user-goal.service';
import * as request from 'supertest';
import { JwtAuthGuardMock } from '../shared/guards/jwt-auth.guard.mock';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';


describe('UserGoal', () => {
    let app: INestApplication;
    let server: any;
    const mockTheory = { content: 'Test content' };
    const jwtGuard = JwtAuthGuardMock;
    const serviceMock = createServiceMock(mockTheory);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserGoalController],
            providers: [{ provide: UserGoalService, useValue: serviceMock }],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(jwtGuard)
            .compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
    });

    describe('create user goal', () => {
        it('successfully', () => {
            return request(server)
                .post('/user-goal')
                .send({ currentTopic: '6288b59786e37c69fcf618a0', goal: '6288b59786e37c69fcf618a0' })
                .expect(HttpStatus.CREATED);
        });

        it(`with error wrong content`, () => {
            return request(server)
                .post('/user-goal')
                .send({})
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('goal must be a mongodb id');
                    expect(res.body.message).toContain('goal should not be empty');
                    expect(res.body.message).toContain('goal must be a string');
                });
        });
    });

    describe('get user goals', () => {
        it('get all user goals', () => {
            return request(server)
                .get('/user-goal')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body.length).toBe(1);
                });
        });
    });

    describe('get one user goal', () => {
        it('get user goal', () => {
            return request(server)
                .get('/user-goal/1')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body).toBeDefined();
                });
        });
    });

    describe('remove user goal', () => {
        it('remove', () => {
            return request(server).delete('/user-goal/1').expect(HttpStatus.OK);
        });
    });
});
