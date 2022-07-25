import { Test, TestingModule } from '@nestjs/testing';
import { TopicSessionsController } from './topic-sessions.controller';
import { TopicSessionsService } from './topic-sessions.service';
import { TopicSessionServiceMock } from './topic-sesstion.service.mock';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestModule } from '../../test/utils/create-test-module';
import * as request from 'supertest';
import { CreateTopicSessionDto } from './dto/create-topic-session.dto';
import { JwtAuthGuardMock } from '../shared/guards/jwt-auth.guard.mock';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { AppError } from '../shared/models/app-error';

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

    describe('create goal', () => {
        it(`successfully`, () => {
            return request(server)
                .post('/topic-sessions')
                .send({
                    topic: '62ddbd8ee764cf9989956383',
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
                });
        });

        it(`with error topic session already exists`, () => {
            topicSessionServiceMock.create.mockRejectedValue(
                new AppError('App: TopicSession already exists'),
            );
            return request(server)
                .post('/topic-sessions')
                .send({
                    topic: '62ddbd8ee764cf9989956383',
                } as any)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('App: TopicSession already exists');
                });
        });

        it(`with error not authorized`, () => {
            jwtGuard.canActivate.mockReturnValueOnce(false);
            return request(server)
                .post('/topic-sessions')
                .send({
                    topic: '62ddbd8ee764cf9989956383',
                } as any)
                .expect(HttpStatus.FORBIDDEN);
        });
    });
});
