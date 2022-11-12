import { IsArray, IsNotEmpty } from 'class-validator';

export class ValidateAnswersDto {
    @IsArray()
    @IsNotEmpty()
    answers: any[]; // todo make it collection of ids of task-instance and answers
}
