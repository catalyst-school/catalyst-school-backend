import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TheoriesController } from './theories.controller';
import { TheoriesService } from './theories.service';
import { createTestModule } from '../../test/utils/create-test-module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UpdateTheoryDto } from './dto/update-theory.dto';
import { CreateTheoryDto } from './dto/create-theory.dto';
import { createServiceMock } from '../../test/utils/create-service-mock';

describe('TheoriesController', () => {
    let app: INestApplication;
    let server: any;
    const mockTheory = { content: 'Test content' };
    const serviceMock = createServiceMock(mockTheory);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TheoriesController],
            providers: [{ provide: TheoriesService, useValue: serviceMock }],
        }).compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
    });

    describe('create theory', () => {
        it(`successfully`, () => {
            return request(server)
                .post('/theories')
                .send({ title: 'test', content: 'Test content' } as CreateTheoryDto)
                .expect(HttpStatus.CREATED);
        });

        it(`with error wrong  content`, () => {
            return request(server)
                .post('/theories')
                .send({} as CreateTheoryDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        'title must be shorter than or equal to 255 characters',
                    );
                    expect(res.body.message).toContain('title must be a string');
                    expect(res.body.message).toContain('content should not be empty');
                    expect(res.body.message).toContain('content must be a string');
                });
        });
    });

    describe('update theory', () => {
        it(`successfully`, () => {
            return request(server)
                .patch('/theories/1')
                .send({ title: 'test', content: 'Test content' } as UpdateTheoryDto)
                .expect(HttpStatus.OK);
        });

        it(`with error wrong content`, () => {
            return request(server)
                .patch('/theories/1')
                .send({ title: '' } as UpdateTheoryDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('content should not be empty');
                });
        });

        it(`with error empty id`, () => {
            return request(server)
                .patch('/theories')
                .send({
                    title: 'test',
                } as UpdateTheoryDto)
                .expect(HttpStatus.NOT_FOUND)
                .expect((res) => {
                    expect(res.body.message).toContain('Cannot PATCH /theories');
                });
        });
    });

    describe('get theories', () => {
        it('get all theories', () => {
            return request(server)
                .get('/theories')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body.length).toBe(1);
                });
        });
    });

    describe('get one theory', () => {
        it('get theory', () => {
            return request(server)
                .get('/theories/1')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body).toBeDefined();
                });
        });
    });

    describe('remove theory', () => {
        it('remove', () => {
            return request(server).delete('/theories/1').expect(HttpStatus.OK);
        });
    });
});
