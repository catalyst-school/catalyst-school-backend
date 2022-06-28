import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService, private configService: ConfigService) {}

    async emailConfirmation(email: string, token: string) {
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@catalyst-school.ru',
            subject: 'Добро пожаловать в онлайн школу Катализатор',
            template: 'email-confirmation',
            context: {
                confirmationLink: `${this.configService.get("HOST")}/email-confirmation?token=${token}`
            }
        });
    }
}
