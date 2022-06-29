import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AppError } from '../shared/models/app-error';
import { EmailService } from '../email/email.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { UserDocument } from '../users/entities/user.schema';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private emailService: EmailService,
        private userService: UsersService,
        private authService: AuthService,
    ) {}

    @Post('email/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        try {
            return await this.authService.login(loginDto);
        } catch (e) {
            if (e instanceof AppError) {
                if (e.message === 'App: Unknown user')
                    throw new HttpException(e.message, HttpStatus.NOT_FOUND);
                else if (e.message === 'App: Email not verified')
                    throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
                else if (e.message === 'App: Invalid password')
                    throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
                else throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            } else throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('email/register')
    async register(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto);
        const userDto = new UserDto(user);
        const token = this.authService.generateToken(user);
        await this.emailService.emailConfirmation(userDto.email, token);
        return userDto;
    }

    @Post('email/confirm')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async confirmEmail(@Req() req: Request) {
        const user = req.user as UserDocument;
        if (user.emailConfirmed)
            throw new HttpException('Email already confirmed', HttpStatus.BAD_REQUEST);

        await this.userService.confirmEmail(user.id);
    }

    @Post('email/forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        try {
            return await this.authService.forgotPassword(forgotPasswordDto);
        } catch (e) {
            if (e instanceof AppError) {
                if (e.message === 'App: Unknown user')
                    throw new HttpException(e.message, HttpStatus.NOT_FOUND);
                else throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            } else throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('email/reset-password')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req: Request) {
        try {
            return await this.authService.resetPassword(
                (req.user as UserDocument)?._id,
                resetPasswordDto,
            );
        } catch (e) {
            if (e instanceof AppError) {
                if (e.message === 'App: Unknown user')
                    throw new HttpException(e.message, HttpStatus.NOT_FOUND);
                else throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            } else throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
