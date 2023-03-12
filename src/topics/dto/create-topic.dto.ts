import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TopicSectionType } from '../entities/topic-section.schema';

export class CreateUnitDto {
    @IsNotEmpty()
    @IsString()
    link: string;
}

export class CreateTopicSectionDto {
    @IsNotEmpty()
    @IsEnum(TopicSectionType)
    type: TopicSectionType;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateUnitDto)
    units?: string[];
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
