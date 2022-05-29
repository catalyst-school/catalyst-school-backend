import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TopicSectionType } from '../entities/topic-section.schema';

export class CreateTaskPropertiesDTO {
    @IsNotEmpty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    @IsNotEmpty()
    sheetId: number;
}

export class CreateTaskDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateTaskPropertiesDTO)
    properties: CreateTaskPropertiesDTO;
}

export class CreateTopicSectionDto {
    @IsNotEmpty()
    @IsEnum(TopicSectionType)
    type: TopicSectionType;

    @IsArray()
    @IsOptional()
    theories?: string[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateTaskDto)
    tasks?: CreateTaskDto[];
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
