import { PartialType } from '@nestjs/swagger';
import { CreateTheoryDto } from './create-theory.dto';

export class UpdateTheoryDto extends PartialType(CreateTheoryDto) {}
