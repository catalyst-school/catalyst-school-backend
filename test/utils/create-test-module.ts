import { ValidationPipe, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from '../../src/shared/filters/http-exception.filter';

export const createTestModule = (module: TestingModule): Promise<INestApplication> => {
    const app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    return app.init();
};
