import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserGoalDto {
    @IsMongoId()
    @IsString()
    currentTopic: string;

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    goal: string;
}
