import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { createServiceMock } from '../../../test/utils/create-service-mock';
import { AchievementsController } from '../achievements.controller';
import { AchievementsService } from '../achievements.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestModule } from '../../../test/utils/create-test-module';
import { CreateAchievementDto } from '../dto/create-achievement.dto';

describe('AchievementsController', () => {
    let app: INestApplication;
    let server: any;
    const mockAchievement = { id: '1' };
    const serviceMock = createServiceMock(mockAchievement);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AchievementsController],
            providers: [{ provide: AchievementsService, useValue: serviceMock }],
        }).compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
    });

    describe('create achievement', () => {
        it(`successfully`, () => {
            return request(server)
                .post('/achievements')
                .send({ title: 'title' } as CreateAchievementDto)
                .expect(HttpStatus.CREATED);
        });

        it(`with error wrong title empty`, () => {
            return request(server)
                .post('/achievements')
                .send({ title: '' } as CreateAchievementDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('title should not be empty');
                });
        });

        it(`with error wrong title type`, () => {
            return request(server)
                .post('/achievements')
                .send({ title: 123 } as any)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        'title must be shorter than or equal to 255 characters',
                    );
                    expect(res.body.message).toContain('title must be a string');
                });
        });
    });

    describe('update achievement', () => {
        it(`successfully`, () => {
            return request(server)
                .patch('/achievements/1')
                .send({
                    title: 'title2',
                } as CreateAchievementDto)
                .expect(HttpStatus.OK);
        });

        it(`with error wrong title`, () => {
            return request(server)
                .patch('/achievements/1')
                .send({ title: 123 } as any)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('title must be a string');
                });
        });

        it(`with error wrong title`, () => {
            return request(server)
                .patch('/achievements/2')
                .send({ title: 'title2' } as any)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .expect((res) => {
                    expect(res.body.message).toContain('Internal server error');
                });
        });
    });

    describe('get achievements', () => {
        it('get all achievements', () => {
            return request(server)
                .get('/achievements')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body.length).toBe(1);
                });
        });
    });

    describe('get one achievement', () => {
        it('get achievement', () => {
            return request(server)
                .get('/achievements/1')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body.id).toBe('1');
                });
        });

        xit('get not exist achievement with error wrong', () => {
            return request(server)
                .get('/achievements/2')
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .expect((res) => {
                    expect(res.body.message).toContain('Internal server error');
                });
        });
    });

    describe('remove achievement', () => {
        it('successfully', () => {
            return request(server).delete('/achievements/1').expect(HttpStatus.OK);
        });

        xit('remove not exist achievement with wrong', () => {
            return request(server)
                .delete('/achievements/2')
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .expect((res) => {
                    expect(res.body.message).toContain('Internal server error');
                });
        });
    });
});
