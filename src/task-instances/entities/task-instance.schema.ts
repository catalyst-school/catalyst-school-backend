import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TaskInstanceDocument = TaskInstance & Document;

@Schema()
export class TaskInstance {
    @Prop({
        type: Number,
        required: true,
    })
    sheetId: number;

    @Prop({
        type: String,
        required: true,
    })
    description: string;

    @Prop({
        type: String,
    })
    type: string;

    @Prop({
        type: String,
    })
    answer: string; // todo make it required
}

export const TaskInstanceSchema = SchemaFactory.createForClass(TaskInstance);
