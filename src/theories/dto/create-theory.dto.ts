import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTheoryDto {
    @IsString()
    @MaxLength(255)
    title?: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
