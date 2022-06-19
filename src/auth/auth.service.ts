import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/entities/user.schema';
import { Model } from 'mongoose';
import { AppError } from '../shared/models/app-error';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async login(loginDto: LoginDto) {
        let userFromDB = await this.userModel.findOne({ email: loginDto.email }).exec();
        if (!userFromDB) throw new AppError('App: Unknown user');
        // todo check email verification

        const isValidPassword = await bcrypt.compare(loginDto.password, userFromDB.password);
        if (!isValidPassword) throw new AppError('App: Invalid password');

        // todo generate token
        return 'token granted';
    }
}
