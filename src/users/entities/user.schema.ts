import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({
        type: String,
        required: true,
    })
    email: string;

    @Prop({
        type: String,
        required: true,
    })
    password: string;

    @Prop({
        type: String,
    })
    name?: string;

    @Prop({
        type: Boolean,
        required: true,
        default: false
    })
    emailConfirmed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
