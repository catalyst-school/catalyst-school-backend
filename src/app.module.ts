import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TopicsModule } from './topics/topics.module';
import { TheoriesModule } from './theories/theories.module';
import { TasksModule } from './tasks/tasks.module';
import { GoalsModule } from './goals/goals.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { TopicSessionsModule } from './topic-sessions/topic-sessions.module';
import { TaskInstancesModule } from './task-instances/task-instances.module';
import { UserGoalModule } from './user-goals/user-goal.module';
import { FilesModule } from './files/files.module';

dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(`mongodb://127.0.0.1/${process.env.DATABASE_NAME}`),
        TopicsModule,
        TheoriesModule,
        TasksModule,
        GoalsModule,
        UsersModule,
        AuthModule,
        EmailModule,
        TopicSessionsModule,
        TaskInstancesModule,
        UserGoalModule,
        FilesModule,
    ],
})
export class AppModule {}
