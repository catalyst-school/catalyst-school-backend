import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async emailConfirmation(email: string) {
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@nestjs.com',
            subject: 'Testing Nest MailerModule',
            html: '<b>Welcome</b>',
        });
    }
}
