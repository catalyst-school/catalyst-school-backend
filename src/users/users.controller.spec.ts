import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { INestApplication } from '@nestjs/common';
import { createServiceMock } from '../../test/utils/create-service-mock';
import { createTestModule } from '../../test/utils/create-test-module';

describe('UsersController', () => {
    let app: INestApplication;
    let server: any;
    const serviceMock = createServiceMock({});
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [{ provide: UsersService, useValue: serviceMock }],
        }).compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
