import { Module } from '@nestjs/common';
import { TopicSessionsService } from './topic-sessions.service';
import { TopicSessionsController } from './topic-sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicSession, TopicSessionSchema } from './entities/topic-session.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: TopicSession.name, schema: TopicSessionSchema }])],
    controllers: [TopicSessionsController],
    providers: [TopicSessionsService],
})
export class TopicSessionsModule {}
