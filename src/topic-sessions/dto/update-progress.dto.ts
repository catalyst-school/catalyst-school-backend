import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateProgressDto {
    @IsNotEmpty()
    @IsMongoId()
    unitId: string;

    answer?: any;
}
