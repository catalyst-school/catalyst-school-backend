import { CreateAchievementDto } from './create-achievement.dto';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAchievementDto extends PartialType(CreateAchievementDto) {
    @MaxLength(255)
    @IsString()
    @IsOptional()
    title?: string;
}
