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

    findOne(id: string) {
        return this.model.findById(id).exec();
    }

    private async generateTopicTasks(topicId: string): Promise<TaskInstanceDocument[]> {
        const topic = await this.topicService.findOne(topicId);
        let tasks = [];
        for (let section of topic.sections) {
            for (let task of section.tasks) {
                const taskInstance = await this.taskInstanceService.create(task.properties.sheetId);
                tasks.push(taskInstance);
            }
        }
        return tasks;
    }
}
