import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';

describe('TopicsController', () => {
    let app: INestApplication;
    const serviceMock = {
        create: jest.fn().mockResolvedValue({}),
        findAll: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TopicsController],
            providers: [{ provide: TopicsService, useValue: serviceMock }],
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe('create topic', () => {
        it(`successfully`, () => {
            const server = app.getHttpServer();
            return request(server)
                .post('/topics')
                .send({ title: 'test' } as CreateTopicDto)
                .expect(HttpStatus.CREATED);
        });

        it(`with error wrong title`, () => {
            const server = app.getHttpServer();
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
            const server = app.getHttpServer();
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
});
