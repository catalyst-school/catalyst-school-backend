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
import { UnitType } from '../entities/unit.schema';

export class CreateUnitDto {
    @IsNotEmpty()
    @IsString()
    link: string;

    @IsNotEmpty()
    @IsEnum(UnitType)
    type: UnitType;
}

export class CreateTopicDto {
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateUnitDto)
    units?: CreateUnitDto[];
}
