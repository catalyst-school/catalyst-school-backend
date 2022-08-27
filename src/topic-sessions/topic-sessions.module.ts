import { forwardRef, Module } from '@nestjs/common';
import { TopicSessionsService } from './topic-sessions.service';
import { TopicSessionsController } from './topic-sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicSession, TopicSessionSchema } from './entities/topic-session.schema';
import { TopicsModule } from '../topics/topics.module';
import { TaskInstancesModule } from '../task-instances/task-instances.module';
import { UserGoalModule } from "../user-goals/user-goal.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TopicSession.name, schema: TopicSessionSchema }]),
        forwardRef(() => TopicsModule),
        forwardRef(() => TaskInstancesModule),
        forwardRef(() => UserGoalModule),
    ],
    controllers: [TopicSessionsController],
    providers: [TopicSessionsService],
    exports: [TopicSessionsService],
})
export class TopicSessionsModule {}
