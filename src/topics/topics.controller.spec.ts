import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';
import { UpdateTopicDto } from './dto/update-topic.dto';

describe('TopicsController', () => {
    let app: INestApplication;
    let server: any;
    const mockTopic = { id: '1'};
    const serviceMock = {
        create: jest.fn().mockResolvedValue({}),
        findAll: jest.fn().mockResolvedValue([mockTopic]),
        findOne: jest.fn().mockResolvedValue(mockTopic),
        update: jest.fn().mockResolvedValue({}),
        remove: jest.fn().mockResolvedValue({}),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TopicsController],
            providers: [{ provide: TopicsService, useValue: serviceMock }],
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        server = app.getHttpServer();
    });

    describe('create topic', () => {
        it(`successfully`, () => {
            return request(server)
                .post('/topics')
                .send({ title: 'test' } as CreateTopicDto)
                .expect(HttpStatus.CREATED);
        });

        it(`with error wrong title`, () => {
            return request(server)
                .post('/topics')
                .send({} as CreateTopicDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        'title must be shorter than or equal to 255 characters',
                    );
                    expect(res.body.message).toContain('title should not be empty');
                });
        });

        it(`with error wrong section type`, () => {
            return request(server)
                .post('/topics')
                .send({
                    title: 'test',
                    sections: [{ type: 'wrong type' as any }],
                } as CreateTopicDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        'sections.0.type must be a valid enum value',
                    );
                });
        });
    });

    describe('update topic', () => {
        it(`successfully`, () => {
            return request(server)
                .patch('/topics/1')
                .send({ title: 'test' } as UpdateTopicDto)
                .expect(HttpStatus.OK);
        });

        it(`with error wrong title`, () => {
            return request(server)
                .patch('/topics/1')
                .send({title: ''} as UpdateTopicDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('title should not be empty');
                });
        });

        it(`with error wrong section type`, () => {
            return request(server)
                .patch('/topics/1')
                .send({
                    title: 'test',
                    sections: [{ type: 'wrong type' as any }],
                } as UpdateTopicDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        'sections.0.type must be a valid enum value',
                    );
                });
        });

        it(`with error empty id`, () => {
            return request(server)
                .patch('/topics')
                .send({
                    title: 'test',
                } as UpdateTopicDto)
                .expect(HttpStatus.NOT_FOUND)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        'Cannot PATCH /topics',
                    );
                });
        });
    });

    describe('get topics', () => {
        it('get all topics', () => {
            return request(server)
                .get('/topics')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body.length).toBe(1);
                });
        });
    });

    describe('get one topic', () => {
        it('get topic', () => {
            return request(server)
                .get('/topics/1')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body.id).toBe('1');
                });
        });
    });

    describe('remove topic', () => {
        it('remove', () => {
            return request(server)
                .delete('/topics/1')
                .expect(HttpStatus.OK);
        });
    });
});
