import { PipeTransform, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FILE_SIZE_ERROR, FILE_TYPE_ERROR } from '../files.costants';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    transform(value: Express.Multer.File): Express.Multer.File {
        const sizeLimit = 5000000;
        if (value.size > sizeLimit) {
            throw new HttpException(FILE_SIZE_ERROR, HttpStatus.BAD_REQUEST);
        } else if (!value.mimetype.includes('image')) {
            throw new HttpException(FILE_TYPE_ERROR, HttpStatus.BAD_REQUEST);
        } else {
            return value;
        }
    }
}
