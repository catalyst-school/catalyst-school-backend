import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAchievementDto {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    img?: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    topics?: string[];

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    goals?: string[];
}
