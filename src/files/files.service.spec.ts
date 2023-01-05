import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { createTestModule } from '../../test/utils/create-test-module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuardMock } from '../shared/guards/jwt-auth.guard.mock';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';

describe('FilesService', () => {
    let service: FilesService;
    let app: INestApplication;
    let server: any;
    const jwtGuard = JwtAuthGuardMock;
    const serviceMock = {
        upload: jest.fn().mockResolvedValue({}),
    };

    const filePictureMock = {
        value: {
            fieldname: 'file',
            originalname: 'IMG_8951.HEIC',
            encoding: '7bit',
            mimetype: 'image/heic',
            buffer: {
                type: 'Buffer',
                data: '',
            },
            size: 584214,
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: FilesService, useValue: serviceMock }],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(jwtGuard)
            .compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
        service = module.get<FilesService>(FilesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    xit('should upload file successfuly', () => {
        return request(server)
            .post('/files/upload')
            .send(filePictureMock)
            .expect(HttpStatus.OK);
    });
});
