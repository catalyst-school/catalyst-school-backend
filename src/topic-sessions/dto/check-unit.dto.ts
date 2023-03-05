import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { TopicSectionType } from '../../topics/entities/topic-section.schema';

export class CheckUnitDto {
    @IsOptional()
    answer?: string;

    @IsNotEmpty()
    @IsMongoId()
    unitId: string;

    @IsNotEmpty()
    sectionType: TopicSectionType;
}
