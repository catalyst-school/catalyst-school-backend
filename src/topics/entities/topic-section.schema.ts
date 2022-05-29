import mongoose, { Document } from 'mongoose';
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

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Theory',
        },
    ])
    theories?: string[];

    @Prop()
    tasks?: {
        properties: {
            title: string,
            sheetId: number
        }
    }[];
}

export const TopicSectionSchema = SchemaFactory.createForClass(TopicSection);
