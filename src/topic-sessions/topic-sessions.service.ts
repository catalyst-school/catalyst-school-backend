import { Injectable } from '@nestjs/common';
import { CreateTopicSessionDto } from './dto/create-topic-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopicSession, TopicSessionDocument } from './entities/topic-session.schema';
import { AppError } from '../shared/models/app-error';
import { TaskInstanceDocument } from '../task-instances/entities/task-instance.schema';
import { TopicsService } from '../topics/topics.service';
import { TaskInstancesService } from '../task-instances/task-instances.service';
import { UserGoalService } from '../user-goals/user-goal.service';
import { TopicSectionDocument, TopicSectionType } from '../topics/entities/topic-section.schema';
import { Topic, TopicDocument } from '../topics/entities/topic.schema';
import { TopicSessionProgress, TopicSessionStatus } from './entities/topic-session-progress.schema';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { GoalsService } from '../goals/goals.service';

@Injectable()
export class TopicSessionsService {
    constructor(
        @InjectModel(TopicSession.name) private model: Model<TopicSessionDocument>,
        private topicService: TopicsService,
        private taskInstanceService: TaskInstancesService,
        private userGoalService: UserGoalService,
        private goalService: GoalsService,
    ) {}

    async create(userId: string, createTopicSessionDto: CreateTopicSessionDto) {
        const userGoal = await this.userGoalService.findOne(createTopicSessionDto.userGoal);
        if (!userGoal) throw new AppError('APP: Unknown user goal');

        const goal = await this.goalService.findOne(userGoal.goal);
        const topic = goal.topics.find((topic) => topic === createTopicSessionDto.topic);
        if (!topic) throw new AppError('APP: Invalid topic');

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

    async findOne(id: string): Promise<TopicSessionDocument> {
        return await this.model.findById(id).exec();
    }

    async updateProgress(id: string, updateProgressDto: UpdateProgressDto) {
        const { sectionId, unitId } = updateProgressDto;

        const session = await this.findOne(id);
        if (!session) throw new AppError('APP: Unknown topic session');

        const topic = await this.topicService.findOne(session.topic, { path: 'sections' });
        if (!topic) throw new AppError('APP: Unknown topic');

        const section = topic.sections.find(
            (section: TopicSectionDocument) => section.id === sectionId,
        ) as TopicSectionDocument;

        if (!section) throw new AppError('APP: Unknown topic section');

        if (section.type === TopicSectionType.TRAINING) {
            // this.checkTrainingAnswer();
        } else if (section.type === TopicSectionType.TEST) {
            // this.checkTestAnswers();
        }

        session.progress = this.calculateProgress(topic, section, unitId);

        return await session.save();
    }

    private calculateProgress(
        topic: TopicDocument,
        section: TopicSectionDocument,
        unitId: string,
    ): TopicSessionProgress {
        const sectionId = section.id;
        const nextUnitId = this.getNextUnitId(section, unitId);

        if (nextUnitId) {
            return { section: sectionId, unit: nextUnitId, status: TopicSessionStatus.Pending };
        }

        const nextSectionId = this.getNextSectionId(topic, section);

        if (nextSectionId) {
            return { section: nextSectionId, status: TopicSessionStatus.Pending };
        }

        return { status: TopicSessionStatus.Completed };
    }

    // todo
    private async generateTopicTasks(topicId: string): Promise<TaskInstanceDocument[]> {
        return [];
        // const topic = await this.topicService.findOne(topicId);
        // const tasks = [];
        // for (const section of topic.sections) {
        //     for (const task of section.tasks) {
        //         const taskInstance = await this.taskInstanceService.create(task.properties.sheetId);
        //         tasks.push(taskInstance);
        //     }
        // }
        // return tasks;
    }

    private getNextUnitId(section: TopicSectionDocument, unitId: string | number): string {
        const unitIndex = section.units.findIndex((unit) => unit.id === unitId);
        return section.units[unitIndex + 1]?.id;
    }

    private getNextSectionId(topic: Topic, section: TopicSectionDocument): string {
        const sectionIndex = topic.sections.findIndex(
            (s: TopicSectionDocument) => s.id === section.id,
        );
        return topic.sections[sectionIndex + 1]?.id;
    }
}
