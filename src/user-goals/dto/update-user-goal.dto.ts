import { PartialType } from '@nestjs/swagger';
import { CreateGoalDto } from '../../goals/dto/create-goal.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';


export class UpdateUserGoalDto extends PartialType(CreateGoalDto) {}
