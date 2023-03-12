import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TopicSection } from '../../topics/entities/topic-section.schema';
import mongoose, { Document } from 'mongoose';

export type TopicSessionDocument = TopicSessionProgress & Document;

export enum TopicSessionStatus {
    Pending = 'pending',
    Completed = 'completed',
}

@Schema()
export class TopicSessionProgress {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TopicSection',
    })
    section?: string;

    @Prop({
        type: String,
        enum: Object.values(TopicSessionStatus),
        default: TopicSessionStatus.Pending,
        required: true,
    })
    status: TopicSessionStatus;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
    })
    unit?: string;
}

export const TopicSessionProgressSchema = SchemaFactory.createForClass(TopicSessionProgress);
