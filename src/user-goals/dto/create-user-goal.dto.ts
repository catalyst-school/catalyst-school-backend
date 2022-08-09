import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserGoalDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    goal: string;
}
