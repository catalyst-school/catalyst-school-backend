import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Unit, UnitDocument } from './unit.schema';

export type TopicDocument = Topic & Document;

@Schema()
export class Topic {
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    title: string;

    @Prop([Unit])
    units: UnitDocument[];

    // todo here will be exam tasks
    exam?: unknown;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
