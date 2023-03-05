import { Injectable } from '@nestjs/common';
import { CreateTopicSessionDto } from './dto/create-topic-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    TopicSession,
    TopicSessionDocument,
    TopicSessionStatus,
} from './entities/topic-session.schema';
import { AppError } from '../shared/models/app-error';
import { TaskInstanceDocument } from '../task-instances/entities/task-instance.schema';
import { TopicsService } from '../topics/topics.service';
import { TaskInstancesService } from '../task-instances/task-instances.service';
import { UserGoalService } from '../user-goals/user-goal.service';
import { CheckUnitDto } from './dto/check-unit.dto';
import { TopicSectionDocument, TopicSectionType } from '../topics/entities/topic-section.schema';
import { Topic } from '../topics/entities/topic.schema';
import { TheoryDocument } from '../theories/entities/theory.schema';

@Injectable()
export class TopicSessionsService {
    constructor(
        @InjectModel(TopicSession.name) private model: Model<TopicSessionDocument>,
        private topicService: TopicsService,
        private taskInstanceService: TaskInstancesService,
        private userGoalService: UserGoalService,
    ) {}

    async create(userId: string, createTopicSessionDto: CreateTopicSessionDto) {
        const userGoal = await this.userGoalService.findOne(createTopicSessionDto.userGoal);
        if (!userGoal) throw new AppError('APP: Unknown user goal');

        // todo check that this topic belongs to user's goal

        const oldSession = await this.model
            .findOne({ topic: createTopicSessionDto.topic, user: userId })
            .exec();

        if (oldSession) {
            return oldSession;
        }

        const tasks = await this.generateTopicTasks(createTopicSessionDto.topic);
        const session = new this.model({ user: userId, tasks, ...createTopicSessionDto });
        await this.userGoalService.setCurrentSession(session.userGoal, session._id);
        return session.save();
    }

    // todo add tests
    // todo maybe split for theory, tasks and control
    // todo think about separating sections for for different types of units
    async checkUnit(topicSessionId: string, checkUnitDto: CheckUnitDto) {
        const session = await this.findOne(topicSessionId);
        if (!session) throw new AppError('APP: Unknown topic session');

        const topic = await this.topicService.findOne(session.topic);
        if (!topic) throw new AppError('APP: Unknown topic');

        const section = topic.sections.find(
            (section) => section.type === checkUnitDto.sectionType,
        ) as TopicSectionDocument;
        if (!section) throw new AppError('APP: Unknown topic section');

        const nextUnitId = this.getNextUnitId(topic, section, checkUnitDto.unitId);
        if (!nextUnitId) session.status = TopicSessionStatus.Completed;

        session.currentUnit = nextUnitId?.toString();

        return session.save();
    }

    async findOne(id: string): Promise<TopicSessionDocument> {
        return await this.model.findById(id).exec();
    }

    private async generateTopicTasks(topicId: string): Promise<TaskInstanceDocument[]> {
        const topic = await this.topicService.findOne(topicId);
        const tasks = [];
        for (const section of topic.sections) {
            for (const task of section.tasks) {
                const taskInstance = await this.taskInstanceService.create(task.properties.sheetId);
                tasks.push(taskInstance);
            }
        }
        return tasks;
    }

    // todo should be way to make it more simple
    // todo check how to work with nested documents
    private getNextUnitId(
        topic: Topic,
        section: TopicSectionDocument,
        unitId: string | number,
    ): string | number {
        const getNextSectionFirstUnit = () => {
            const sectionIndex = topic.sections.findIndex(
                (s: TopicSectionDocument) => s._id === section._id,
            );

            if (topic.sections[sectionIndex + 1]) {
                const nextSection = topic.sections[sectionIndex + 1];
                if (nextSection.type === TopicSectionType.THEORY) {
                    return nextSection.theories[0];
                }
                if (nextSection.type === TopicSectionType.TRAINING) {
                    return nextSection.tasks[0].properties.sheetId;
                }
            }
        };

        if (section.type === TopicSectionType.THEORY) {
            const currentIndex = section.theories?.findIndex(
                (theory) => (theory as any as TheoryDocument)._id.toString() === unitId,
            );
            if (section?.theories[currentIndex + 1]) {
                return (section?.theories[currentIndex + 1] as any as TheoryDocument)._id;
            }
            return getNextSectionFirstUnit();
        }

        if (section.type === TopicSectionType.TRAINING) {
            const currentIndex = section.tasks.findIndex(
                (task) => task.properties.sheetId === unitId,
            );
            if (section.tasks[currentIndex + 1]) {
                return section.tasks[currentIndex + 1].properties.sheetId;
            }
            return getNextSectionFirstUnit();
        }
    }
}
