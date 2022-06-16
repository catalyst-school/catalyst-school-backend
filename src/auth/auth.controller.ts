import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private userService: UsersService) {}

    @Post('email/register')
    async register(@Body() createUserDto: CreateUserDto) {
        return new UserDto(await this.userService.create(createUserDto));
    }
}
