import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserGoalDocument = UserGoal & Document;

@Schema()
export class UserGoal {
    @Prop({
        type: Number,
        required: true,
        default: 0,
    })
    progress: number;

    @Prop(
        {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Goal',
        },
    )
    goal: string;

    @Prop(
        {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    )
    user: string;

    @Prop(
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic',
        },
    )
    currentTopic: string;
}

export const UserGoalSchema = SchemaFactory.createForClass(UserGoal);
