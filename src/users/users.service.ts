import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { isEmail } from 'class-validator';
import { AppError } from '../shared/models/app-error';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto: CreateUserDto) {
        if (isEmail(createUserDto.email)) {
            const existingUser = await this.userModel
                .findOne({ email: createUserDto.email })
                .exec();
            if (existingUser) {
                throw new AppError('APP: User already registered');
            }
            createUserDto.password = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
            const newUser = new this.userModel(createUserDto);
            return await newUser.save();
        } else {
            throw new AppError('APP: Invalid email');
        }
    }

    async confirmEmail(id: string) {
        await this.userModel.findByIdAndUpdate(id, { emailConfirmed: true }).exec();
    }

    findById(id: string) {
        return this.userModel.findById(id).exec();
    }

    findByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async updatePassword(id: string, newPassword: string) {
        const password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        return this.userModel.findByIdAndUpdate(id, { password }).exec();
    }
}
