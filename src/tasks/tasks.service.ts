import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import { APIEndpoint } from 'googleapis-common';
import * as dotenv from 'dotenv';

dotenv.config();

export enum ColumnNames {
    Description = 'description',
}

@Injectable()
export class TasksService {
    private auth: GoogleAuth;
    private client;
    private googleSheets: APIEndpoint;

    constructor() {
        this.initGoogleServices().then();
    }

    /**
     * ToDo: restore functionality of this method
     * @param sheetId
     */
    async getTaskData(sheetId: number): Promise<object> {
        return {
            description: 'Мок задача',
        };

        // const sheets = await this.findAll();
        // const sheet = sheets.find((s) => s.properties.sheetId === sheetId);
        //
        // const titlesRange = await this.googleSheets.spreadsheets.values.get({
        //     spreadsheetId: process.env.GOOGLE_SHEET_ID,
        //     range: `${sheet.properties.title}!A1:1`,
        // });
        // const titles: string[] = titlesRange.data.values[0];
        // const columnIndexMap = new Map<ColumnNames, number>();
        // Object.values(ColumnNames).forEach((columnName) => {
        //     const index = titles.findIndex((title) => title === columnName);
        //     columnIndexMap.set(columnName, index);
        // });
        //
        // const valuesRange = await this.googleSheets.spreadsheets.values.get({
        //     spreadsheetId: process.env.GOOGLE_SHEET_ID,
        //     range: `${sheet.properties.title}!A2:ZZZ`,
        // });
        // const values = valuesRange.data.values;
        // const taskRawArray = this.getRandomItem(values) as string[];
        // const taskData = {};
        // Object.values(ColumnNames).forEach((columnName) => {
        //     taskData[columnName] = taskRawArray[columnIndexMap.get(columnName)];
        // });
        // return taskData;
    }

    /**
     * ToDo: restore functionality of this method
     */
    async findAll(): Promise<any> {
        return [];
        // const metadata = await this.googleSheets.spreadsheets.get({
        //     auth: this.auth,
        //     spreadsheetId: process.env.GOOGLE_SHEET_ID,
        // });
        //
        // return metadata.data.sheets;
    }

    private async initGoogleServices() {
        // this.auth = new google.auth.GoogleAuth({
        //     keyFile: 'google-sheets-creds.json',
        //     scopes: 'https://www.googleapis.com/auth/spreadsheets',
        // });
        // try {
        //     this.client = await this.auth.getClient();
        // } catch (e) {
        //     console.log(e);
        // }
        // this.googleSheets = google.sheets({ version: 'v4', auth: this.client });
    }

    private getRandomItem(items: unknown[]): unknown {
        return items[Math.floor(Math.random() * items.length)];
    }
}
