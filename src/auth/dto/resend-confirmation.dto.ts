import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendConfirmationDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
