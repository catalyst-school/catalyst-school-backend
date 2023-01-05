import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    transform(value: Express.Multer.File) {
        const oneKb = 5000000;
        return value.size < oneKb;
    }
}
