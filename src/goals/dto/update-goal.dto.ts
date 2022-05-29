import { PartialType } from '@nestjs/swagger';
import { CreateGoalDto } from './create-goal.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
    @IsOptional()
    @IsString()
    title?: string;
}
