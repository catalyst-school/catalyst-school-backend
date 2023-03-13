import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GoalDocument = Goal & Document;

@Schema()
export class Goal {
    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    title: string;

    @Prop({
        type: String,
        required: true,
    })
    image: string;

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic',
        },
    ])
    topics?: string[];

    @Prop({
        type: String,
    })
    img?: string;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
