import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserGoalDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    user: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    currentTopic?: string[];

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    goal: string;

    @IsString()
    @IsOptional()
    string?: string;
}
