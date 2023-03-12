import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Topic } from '../../topics/entities/topic.schema';
import mongoose, { Document } from 'mongoose';
import { TopicSessionProgress } from './topic-session-progress.schema';

export type TopicSessionDocument = TopicSession & Document;

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

    @Prop(TopicSessionProgress)
    progress?: TopicSessionProgress;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserGoal',
    })
    userGoal: string;
}

export const TopicSessionSchema = SchemaFactory.createForClass(TopicSession);
