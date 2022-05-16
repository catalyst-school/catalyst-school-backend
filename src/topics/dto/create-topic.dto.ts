import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TopicSectionType } from "../entities/topic-section.schema";

export class CreateTopicSectionDto {
    @IsNotEmpty()
    @IsEnum(TopicSectionType)
    type: TopicSectionType;

    @IsArray()
    @IsOptional()
    theories?: [];

    @IsArray()
    @IsOptional()
    tasks?: [];
}

export class CreateTopicDto {
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateTopicSectionDto)
    sections?: CreateTopicSectionDto[];
}
