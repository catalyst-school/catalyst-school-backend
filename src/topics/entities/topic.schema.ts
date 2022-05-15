import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TopicDocument = Topic & Document;

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

@Schema()
export class Topic {
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    title: string;

    @Prop([TopicSection])
    sections?: [];
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
export const TopicSectionSchema = SchemaFactory.createForClass(TopicSection);
