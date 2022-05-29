import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { createServiceMock } from '../../test/utils/create-service-mock';
import { TasksService } from './tasks.service';
import { createTestModule } from '../../test/utils/create-test-module';

describe('TasksController', () => {
    let app: INestApplication;
    let server: any;
    const serviceMock = createServiceMock(null);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [{ provide: TasksService, useValue: serviceMock }],
        }).compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
    });

    describe('get tasks', () => {
        it('get all tasks', () => {
            return request(server).get('/tasks').expect(HttpStatus.OK);
        });
    });
});
