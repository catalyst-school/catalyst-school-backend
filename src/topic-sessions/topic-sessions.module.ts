import { forwardRef, Module } from '@nestjs/common';
import { TopicSessionsService } from './topic-sessions.service';
import { TopicSessionsController } from './topic-sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicSession, TopicSessionSchema } from './entities/topic-session.schema';
import { TopicsModule } from '../topics/topics.module';
import { TaskInstancesModule } from '../task-instances/task-instances.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TopicSession.name, schema: TopicSessionSchema }]),
        forwardRef(() => TopicsModule),
        forwardRef(() => TaskInstancesModule),
    ],
    controllers: [TopicSessionsController],
    providers: [TopicSessionsService],
    exports: [TopicSessionsService],
})
export class TopicSessionsModule {}
