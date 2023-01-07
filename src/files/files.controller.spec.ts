import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { createTestModule } from '../../test/utils/create-test-module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuardMock } from '../shared/guards/jwt-auth.guard.mock';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { FilesController } from './files.controller';
import { path } from 'app-root-path';

describe('Files', () => {
    let app: INestApplication;
    let server: any;

    const jwtGuard = JwtAuthGuardMock;
    const uploadFolder = `${path}/uploads`;
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
    const serviceMock = {
        saveFile: jest.fn().mockResolvedValue({
            url: `${uploadFolder}/${filePictureMock.value.originalname}`,
            name: filePictureMock.value.originalname,
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: FilesService, useValue: serviceMock }],
            controllers: [FilesController],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(jwtGuard)
            .compile();

        app = await createTestModule(module);
        server = app.getHttpServer();
    });

    // it('should upload file successfuly', () => {
    //     return request(server)
    //         .post('/files/upload')
    //         .send(filePictureMock)
    //         .expect(HttpStatus.OK);
    // });

    it(`with error not authorized`, () => {
        jwtGuard.canActivate.mockReturnValueOnce(false);

        return request(server)
            .post('/files/upload')
            .send(filePictureMock)
            .expect(HttpStatus.FORBIDDEN);
    });
});
