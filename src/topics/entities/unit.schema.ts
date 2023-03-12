import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UnitDocument = Unit & Document;

export enum UnitType {
    Theory = 'theory',
    Task = 'task',
}

@Schema()
export class Unit {
    @Prop({
        type: String,
        required: true,
    })
    ref: string;

    @Prop({
        type: String,
        enum: Object.values(UnitType),
        required: true,
    })
    type: UnitType;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
