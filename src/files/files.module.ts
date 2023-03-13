import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { path } from 'app-root-path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: `${path}/uploads`,
            serveRoot: '/file',
        }),
    ],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService],
})
export class FilesModule {}
