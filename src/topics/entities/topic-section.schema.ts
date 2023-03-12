import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Unit, UnitDocument } from './unit.schema';

export type TopicSectionDocument = TopicSection & Document;

export enum TopicSectionType {
    THEORY = 'theory',
    TRAINING = 'training',
    TEST = 'test',
}

@Schema()
export class TopicSection {
    @Prop({
        type: String,
        enum: Object.values(TopicSectionType),
        required: true,
    })
    type: TopicSectionType;

    @Prop([Unit])
    units?: UnitDocument[];
}

export const TopicSectionSchema = SchemaFactory.createForClass(TopicSection);
