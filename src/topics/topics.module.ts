import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Topic,
    TopicSchema,
    TopicSection,
    TopicSectionSchema,
} from './entities/topic.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Topic.name, schema: TopicSchema },
            { name: TopicSection.name, schema: TopicSectionSchema },
        ]),
    ],
    controllers: [TopicsController],
    providers: [TopicsService],
})
export class TopicsModule {}
