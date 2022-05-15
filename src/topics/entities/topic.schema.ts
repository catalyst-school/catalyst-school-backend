import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TopicSection } from './topic-section.schema';

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
    sections?: [];
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
