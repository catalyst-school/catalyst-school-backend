import { ValidationPipe, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

export const createTestModule = (module: TestingModule): Promise<INestApplication> => {
    const app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    return app.init();
};
