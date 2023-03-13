import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGoalDto {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    topics?: string[];
}
