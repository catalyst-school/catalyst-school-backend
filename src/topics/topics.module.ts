import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic, TopicSchema } from './entities/topic.schema';
import { TopicSection, TopicSectionSchema } from './entities/topic-section.schema';
import { Unit, UnitSchema } from './entities/unit.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Topic.name, schema: TopicSchema },
            { name: TopicSection.name, schema: TopicSectionSchema },
            { name: Unit.name, schema: UnitSchema },
        ]),
    ],
    controllers: [TopicsController],
    providers: [TopicsService],
    exports: [TopicsService],
})
export class TopicsModule {}
