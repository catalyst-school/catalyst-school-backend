import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FilePictureDto } from './dto/file-picture.dto';

@Injectable()
export class FilesService {
    async saveFile(file: Express.Multer.File): Promise<FilePictureDto> {
        const uploadFolder = `${path}/uploads`;
        await ensureDir(uploadFolder);

        await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
        return { url: `${uploadFolder}/${file.originalname}`, name: file.originalname };
    }
}
