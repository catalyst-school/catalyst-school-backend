import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TopicsModule } from './topics/topics.module';
import { TheoriesModule } from './theories/theories.module';
import { TasksModule } from './tasks/tasks.module';
import { GoalsModule } from './goals/goals.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { EmailModule } from './email/email.module';
import { TopicSessionsModule } from './topic-sessions/topic-sessions.module';
import { UserGoalModule } from './user-goals/user-goal.module';

dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(`mongodb://localhost/${process.env.DATABASE_NAME}`),
        TopicsModule,
        TheoriesModule,
        TasksModule,
        GoalsModule,
        UsersModule,
        AuthModule,
        EmailModule,
        TopicSessionsModule,
        UserGoalModule,
    ],
})
export class AppModule {}
