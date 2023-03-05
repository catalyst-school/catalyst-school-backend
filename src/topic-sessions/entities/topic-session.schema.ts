import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TopicSection } from '../../topics/entities/topic-section.schema';
import { Topic } from '../../topics/entities/topic.schema';
import mongoose, { Document } from 'mongoose';

export type TopicSessionDocument = TopicSession & Document;

export enum TopicSessionStatus {
    Pending = 'pending',
    Completed = 'completed',
}

@Schema()
export class TopicSession {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
    })
    topic: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    user: string;

    @Prop({
        type: String,
    })
    currentUnit?: string;

    @Prop({
        type: String,
        enum: Object.values(TopicSessionStatus),
        default: TopicSessionStatus.Pending,
        required: true,
    })
    status: TopicSessionStatus;

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
    ])
    tasks?: string[];

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserGoal',
    })
    userGoal: string;
}

export const TopicSessionSchema = SchemaFactory.createForClass(TopicSession);
