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
    desc: string;

    @Prop({
        type: String,
    })
    option1?: string;

    @Prop({
        type: String,
    })
    option2?: string;

    @Prop({
        type: String,
    })
    option3?: string;
}

export const TaskInstanceSchema = SchemaFactory.createForClass(TaskInstance);
