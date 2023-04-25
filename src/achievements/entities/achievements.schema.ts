import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AchievementDocument = Achievement & Document;

@Schema()
export class Achievement {
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    title: string;

    @Prop({
        type: String,
        required: false,
    })
    img?: string;

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic',
        },
    ])
    topics?: string[];

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Goal',
        },
    ])
    goals?: string[];
}

export const AchievementsSchema = SchemaFactory.createForClass(Achievement);
