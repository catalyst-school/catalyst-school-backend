import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TopicsModule } from './topics/topics.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(
            `mongodb://localhost/${process.env.DATABASE_NAME}`,
        ),
        TopicsModule,
    ],
})
export class AppModule {}
