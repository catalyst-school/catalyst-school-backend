import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { TopicSectionType } from '../entities/topic.schema';
import { Type } from 'class-transformer';

export class CreateTopicSectionDto {
    @IsNotEmpty()
    @IsEnum(TopicSectionType)
    type: TopicSectionType;

    @IsArray()
    @IsOptional()
    units: [];
}

export class CreateTopicDto {
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTopicSectionDto)
    sections?: CreateTopicSectionDto[];
}
