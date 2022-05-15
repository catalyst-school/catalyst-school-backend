import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

    @Prop()
    units: [];
}

export const TopicSectionSchema = SchemaFactory.createForClass(TopicSection);
