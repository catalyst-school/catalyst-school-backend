import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TheoryDocument = Theory & Document;

@Schema()
export class Theory {
    @Prop({
        type: String,
        trim: true,
    })
    title?: string;

    @Prop({
        type: String,
        required: true,
    })
    content?: string;
}

export const TheorySchema = SchemaFactory.createForClass(Theory);
