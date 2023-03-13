import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FilePictureDto } from './dto/file-picture.dto';
import { AppError } from '../shared/models/app-error';

@Injectable()
export class FilesService {
    async saveFile(id: string, file: Express.Multer.File): Promise<FilePictureDto> {
        const uploadFolder = `/uploads`;
        await ensureDir(`${path}${uploadFolder}`);
        try {
            const savedFileName = `${id}_${file.originalname}`;
            await writeFile(`${path}${uploadFolder}/${savedFileName}`, file.buffer);

            return {
                url: `${uploadFolder}/${file.originalname}`,
                name: savedFileName,
            };
        } catch (e) {
            throw new AppError(e.message);
        }
    }
}
