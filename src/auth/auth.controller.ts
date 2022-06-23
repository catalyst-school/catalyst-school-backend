import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AppError } from '../shared/models/app-error';
import { EmailService } from '../email/email.service';

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
}
