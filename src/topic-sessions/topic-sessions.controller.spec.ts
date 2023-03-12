import { Test, TestingModule } from '@nestjs/testing';
import { TopicSessionsController } from './topic-sessions.controller';
import { TopicSessionsService } from './topic-sessions.service';
import { TopicSessionServiceMock } from './topic-session.service.mock';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestModule } from '../../test/utils/create-test-module';
import * as request from 'supertest';
import { CreateTopicSessionDto } from './dto/create-topic-session.dto';
import { JwtAuthGuardMock } from '../shared/guards/jwt-auth.guard.mock';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { AppError } from '../shared/models/app-error';
import { UpdateProgressDto } from './dto/update-progress.dto';

describe('TopicSessionsController', () => {
    let app: INestApplication;
    let server: any;
    const jwtGuard = JwtAuthGuardMock;
    const topicSessionServiceMock = TopicSessionServiceMock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TopicSessionsController],
            providers: [{ provide: TopicSessionsService, useValue: topicSessionServiceMock }],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(jwtGuard)
            .compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
    });

    describe('create topic session', () => {
        it(`successfully`, () => {
            return request(server)
                .post('/topic-sessions')
                .send({
                    topic: '62ddbd8ee764cf9989956383',
                    userGoal: '62ddbd8ee764cf9989956383',
                } as CreateTopicSessionDto)
                .expect(HttpStatus.CREATED);
        });

        it(`with error wrong topic`, () => {
            return request(server)
                .post('/topic-sessions')
                .send({} as CreateTopicSessionDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('topic must be a mongodb id');
                    expect(res.body.message).toContain('topic should not be empty');
                    expect(res.body.message).toContain('topic must be a string');
                    expect(res.body.message).toContain('userGoal must be a mongodb id');
                    expect(res.body.message).toContain('userGoal should not be empty');
                    expect(res.body.message).toContain('userGoal must be a string');
                });
        });

        it(`with error unknown user goal`, () => {
            topicSessionServiceMock.create.mockRejectedValueOnce(
                new AppError('APP: Unknown user goal'),
            );
            return request(server)
                .post('/topic-sessions')
                .send({
                    topic: '62ddbd8ee764cf9989956383',
                    userGoal: '62ddbd8ee764cf9989956383',
                } as CreateTopicSessionDto)
                .expect(HttpStatus.NOT_FOUND)
                .expect((res) => {
                    expect(res.body.message).toContain('APP: Unknown user goal');
                });
        });

        it(`with error unknown user goal`, () => {
            topicSessionServiceMock.create.mockRejectedValueOnce(
                new AppError('APP: Invalid topic'),
            );
            return request(server)
                .post('/topic-sessions')
                .send({
                    topic: '62ddbd8ee764cf9989956383',
                    userGoal: '62ddbd8ee764cf9989956383',
                } as CreateTopicSessionDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('APP: Invalid topic');
                });
        });

        it(`with error not authorized`, () => {
            jwtGuard.canActivate.mockReturnValueOnce(false);
            return request(server)
                .post('/topic-sessions')
                .send({
                    topic: '62ddbd8ee764cf9989956383',
                    userGoal: '62ddbd8ee764cf9989956383',
                } as any)
                .expect(HttpStatus.FORBIDDEN);
        });
    });

    describe('update progress goal', () => {
        it(`successfully`, () => {
            return request(server)
                .post('/topic-sessions/62ddbd8ee764cf9989956383/update-progress')
                .send({
                    unitId: '62ddbd8ee764cf9989956383',
                } as UpdateProgressDto)
                .expect(HttpStatus.OK);
        });

        it(`with error dtos`, () => {
            return request(server)
                .post('/topic-sessions/62ddbd8ee764cf9989956383/update-progress')
                .send({} as UpdateProgressDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('unitId must be a mongodb id');
                    expect(res.body.message).toContain('unitId should not be empty');
                });
        });

        it(`with wrong user`, () => {
            topicSessionServiceMock.findOne.mockResolvedValueOnce({ user: '23222' });
            return request(server)
                .post('/topic-sessions/62ddbd8ee764cf9989956383/update-progress')
                .send({
                    unitId: '62ddbd8ee764cf9989956383',
                } as UpdateProgressDto)
                .expect(HttpStatus.FORBIDDEN)
                .expect((res) => {
                    expect(res.body.message).toContain('APP: Access denied');
                });
        });

        it(`with unknown topic session`, () => {
            topicSessionServiceMock.updateProgress.mockRejectedValueOnce(
                new AppError('APP: Unknown topic session'),
            );
            return request(server)
                .post('/topic-sessions/62ddbd8ee764cf9989956383/update-progress')
                .send({
                    unitId: '62ddbd8ee764cf9989956383',
                } as UpdateProgressDto)
                .expect(HttpStatus.NOT_FOUND)
                .expect((res) => {
                    expect(res.body.message).toContain('APP: Unknown topic session');
                });
        });

        it(`with unknown topic`, () => {
            topicSessionServiceMock.updateProgress.mockRejectedValueOnce(
                new AppError('APP: Unknown topic'),
            );
            return request(server)
                .post('/topic-sessions/62ddbd8ee764cf9989956383/update-progress')
                .send({
                    unitId: '62ddbd8ee764cf9989956383',
                } as UpdateProgressDto)
                .expect(HttpStatus.NOT_FOUND)
                .expect((res) => {
                    expect(res.body.message).toContain('APP: Unknown topic');
                });
        });
    });
});
