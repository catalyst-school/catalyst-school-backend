import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateTopicSessionDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    topic: string;

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    userGoal: string;
}
