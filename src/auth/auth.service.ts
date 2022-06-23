import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/entities/user.schema';
import { Model } from 'mongoose';
import { AppError } from '../shared/models/app-error';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    generateToken(user: UserDocument): string {
        const payload = { id: user._id };
        return this.jwtService.sign(payload);
    }

    async login(loginDto: LoginDto) {
        let userFromDB = await this.userModel.findOne({ email: loginDto.email }).exec();
        if (!userFromDB) throw new AppError('App: Unknown user');

        if (!userFromDB.emailConfirmed) throw new AppError('App: Email not verified');

        const isValidPassword = await bcrypt.compare(loginDto.password, userFromDB.password);
        if (!isValidPassword) throw new AppError('App: Invalid password');

        return this.generateToken(userFromDB);
    }
}
