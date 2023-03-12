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
import { TopicDocument } from '../topics/entities/topic.schema';
import { TopicSessionProgress, TopicSessionStatus } from './entities/topic-session-progress.schema';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { GoalsService } from '../goals/goals.service';
import { UnitDocument, UnitType } from '../topics/entities/unit.schema';

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
        const { unitId } = updateProgressDto;

        const session = await this.findOne(id);
        if (!session) throw new AppError('APP: Unknown topic session');

        const topic = await this.topicService.findOne(session.topic, { path: 'units' });
        if (!topic) throw new AppError('APP: Unknown topic');

        const unit = topic.units.find((unit) => unit.id === unitId);
        if (!unit) throw new AppError('APP: Unknown unit');

        if (unit.type === UnitType.Task) {
            // this.checkTrainingAnswer();
        }

        session.progress = this.calculateProgress(topic, unit);
        return await session.save();
    }

    private calculateProgress(topic: TopicDocument, unit: UnitDocument): TopicSessionProgress {
        const nextUnitId = this.getNextUnitId(topic, unit);

        if (nextUnitId) {
            return { unit: nextUnitId, status: TopicSessionStatus.Pending };
        }

        return { status: TopicSessionStatus.Completed };
    }

    // todo
    private async generateTopicTasks(topicId: string): Promise<TaskInstanceDocument[]> {
        return [];
    }

    private getNextUnitId(topic: TopicDocument, unit: UnitDocument): string {
        const unitIndex = topic.units.findIndex((u) => u.id === unit.id);
        return topic.units[unitIndex + 1]?.id;
    }
}
