import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

const mailJet = require('node-mailjet');

dotenv.config();

@Injectable()
export class EmailService {
    private mailjet;
    constructor(private configService: ConfigService) {
        this.mailjet = new mailJet({
            apiKey: process.env.MJ_APIKEY_PUBLIC,
            apiSecret: process.env.MJ_APIKEY_PRIVATE,
        });
    }

    async emailConfirmation(email: string, token: string) {
        await this.mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'no-reply@catalyst-school.ru',
                        Name: 'Команда школы Катализатор',
                    },
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    Subject: 'Добро пожаловать в онлайн школу Катализатор',
                    HTMLPart: `
                        <h3>Добро пожаловать в онлайн школу Катализатор</h3>
                        <p><a href='${this.configService.get(
                            'HOST',
                        )}/email-confirmation?token=${token}' target='_blank'>Подтвердить Email</a>
                        </p>
                    `,
                },
            ],
        });
    }

    async forgotPassword(email: string, token: string) {
        await this.mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'noreply@catalyst-school.ru',
                        Name: 'Команда школы Катализатор',
                    },
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    Subject: 'Восстановление пароля на сайте школы Катализатор',
                    HTMLPart: `
                        <h3>Восстановление пароля</h3>
                        <p><a href='${this.configService.get(
                            'HOST',
                        )}/reset-password?token=${token}' target='_blank'>Восстановить пароль</a></p>
                    `,
                },
            ],
        });
    }
}
