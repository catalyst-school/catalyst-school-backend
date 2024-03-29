import {
    Controller,
    HttpCode,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { FilePictureDto } from './dto/file-picture.dto';
import { FilesService } from './files.service';
import { FileSizeValidationPipe } from './pipes/file-size-validation.pipe';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('upload')
    @HttpCode(200)
    @UsePipes(new FileSizeValidationPipe())
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FilePictureDto> {
        return this.filesService.saveFile(file);
    }
}
