import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UnitDocument = Unit & Document;

@Schema()
export class Unit {
    @Prop({
        type: String,
        required: true,
    })
    link: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
