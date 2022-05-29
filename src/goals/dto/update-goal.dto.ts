import { PartialType } from '@nestjs/swagger';
import { CreateGoalDto } from './create-goal.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;
}
