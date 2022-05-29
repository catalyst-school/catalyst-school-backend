import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TopicsModule } from './topics/topics.module';
import { TheoriesModule } from './theories/theories.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(
            `mongodb://localhost/${process.env.DATABASE_NAME}`,
        ),
        TopicsModule,
        TheoriesModule,
        TasksModule,
    ],
})
export class AppModule {}
