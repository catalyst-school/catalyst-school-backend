import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TopicSection, TopicSectionDocument } from './topic-section.schema';

export type TopicDocument = Topic & Document;

@Schema()
export class Topic {
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    title: string;

    @Prop([TopicSection])
    sections?: TopicSectionDocument[];
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
