import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGoalDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    topics?: string[];
}
