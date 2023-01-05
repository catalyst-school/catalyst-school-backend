import { IsNotEmpty, IsString } from 'class-validator';

export class FilePictureDto {
    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
