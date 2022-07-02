import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/entities/user.schema';
import { AppError } from '../shared/models/app-error';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from '../email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private emailService: EmailService,
        private userService: UsersService,
    ) {}

    generateToken(user: UserDocument): string {
        const payload = { id: user._id };
        return this.jwtService.sign(payload);
    }

    async login(loginDto: LoginDto) {
        let userFromDB = await this.userService.findByEmail(loginDto.email);
        if (!userFromDB) throw new AppError('App: Unknown user');

        const isValidPassword = await bcrypt.compare(loginDto.password, userFromDB.password);
        if (!isValidPassword) throw new AppError('App: Invalid password');

        if (!userFromDB.emailConfirmed) throw new AppError('App: Email not verified');

        return this.generateToken(userFromDB);
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        let userFromDB = await this.userService.findByEmail(forgotPasswordDto.email);
        if (!userFromDB) throw new AppError('App: Unknown user');

        const token = this.generateToken(userFromDB);
        await this.emailService.forgotPassword(userFromDB.email, token);
    }

    async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
        let userFromDB = await this.userService.findById(userId);
        if (!userFromDB) throw new AppError('App: Unknown user');

        await this.userService.updatePassword(userFromDB._id, resetPasswordDto.password);
    }
}
