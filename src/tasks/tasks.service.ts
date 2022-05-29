import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable()
export class TasksService {
    private auth: GoogleAuth;
    private client;
    private googleSheets;

    constructor() {
        this.initGoogleServices().then();
    }

    async findAll(): Promise<any> {
        const metadata = await this.googleSheets.spreadsheets.get({
            auth: this.auth,
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
        });

        return metadata.data.sheets;
    }

    private async initGoogleServices() {
        this.auth = new google.auth.GoogleAuth({
            keyFile: 'google-sheets-creds.json',
            scopes: 'https://www.googleapis.com/auth/spreadsheets',
        });
        this.client = await this.auth.getClient();
        this.googleSheets = google.sheets({ version: 'v4', auth: this.client });
    }
}
