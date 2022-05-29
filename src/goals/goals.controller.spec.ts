import { Test, TestingModule } from '@nestjs/testing';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createServiceMock } from '../../test/utils/create-service-mock';
import { createTestModule } from '../../test/utils/create-test-module';
import * as request from 'supertest';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from "./dto/update-goal.dto";

describe('GoalsController', () => {
    let app: INestApplication;
    let server: any;
    const mockGoal = { id: '1' };
    const serviceMock = createServiceMock(mockGoal);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GoalsController],
            providers: [{ provide: GoalsService, useValue: serviceMock }],
        }).compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
    });

    describe('create goal', () => {
        it(`successfully`, () => {
            return request(server)
                .post('/goals')
                .send({
                    title: 'test',
                    topics: ["123234234"]
                } as CreateGoalDto)
                .expect(HttpStatus.CREATED);
        });

        it(`with error wrong title`, () => {
            return request(server)
                .post('/goals')
                .send({} as CreateGoalDto)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        'title must be shorter than or equal to 255 characters',
                    );
                    expect(res.body.message).toContain('title should not be empty');
                });
        });

        it(`with error wrong topics type`, () => {
            return request(server)
                .post('/goals')
                .send({
                    title: 'test',
                    topics: "string",
                } as any)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain(
                        'topics must be an array',
                    );
                });
        });
    });

    describe('update goal', () => {
        it(`successfully`, () => {
            return request(server)
                .patch('/goals/1')
                .send({
                    title: 'test',
                    sections: ["12345"]
                } as UpdateGoalDto)
                .expect(HttpStatus.OK);
        });

        it(`with error wrong title`, () => {
            return request(server)
                .patch('/goals/1')
                .send({ title: 1234 } as any)
                .expect(HttpStatus.BAD_REQUEST)
                .expect((res) => {
                    expect(res.body.message).toContain('title must be shorter than or equal to 255 characters');
                    expect(res.body.message).toContain('title must be a string');
                });
        });

        it(`with error empty id`, () => {
            return request(server)
                .patch('/goals')
                .send({
                    title: 'test',
                } as UpdateGoalDto)
                .expect(HttpStatus.NOT_FOUND)
                .expect((res) => {
                    expect(res.body.message).toContain('Cannot PATCH /goals');
                });
        });
    });

    describe('get goals', () => {
        it('get all goals', () => {
            return request(server)
                .get('/goals')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body.length).toBe(1);
                });
        });
    });

    describe('get one goal', () => {
        it('get goal', () => {
            return request(server)
                .get('/goals/1')
                .expect(HttpStatus.OK)
                .expect((res) => {
                    expect(res.body.id).toBe('1');
                });
        });
    });

    describe('remove goal', () => {
        it('remove', () => {
            return request(server).delete('/goals/1').expect(HttpStatus.OK);
        });
    });
});
