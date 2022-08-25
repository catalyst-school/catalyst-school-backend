import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserGoal, UserGoalDocument } from './entities/user-goal.schema';
import { Model } from 'mongoose';
import { CreateUserGoalDto } from './dto/create-user-goal.dto';
import { GoalsService } from '../goals/goals.service';
import { AppError } from '../shared/models/app-error';
import { TopicSession } from "../topic-sessions/entities/topic-session.schema";

export type FilterOptions = Partial<UserGoal>;

@Injectable()
export class UserGoalService {
    constructor(
        @InjectModel(UserGoal.name) private userGoalModel: Model<UserGoalDocument>,
        private goalsService: GoalsService,
    ) {}

    async create(
        createUserGoalDto: CreateUserGoalDto & { user: string },
    ): Promise<UserGoalDocument> {
        const goal = await this.goalsService.findOne(createUserGoalDto.goal, true);
        if (!goal) throw new AppError('APP: Goal not found');

        const userGoal = new this.userGoalModel(createUserGoalDto);
        return userGoal.save();
    }

    async findAll(options?: FilterOptions): Promise<UserGoalDocument[]> {
        return this.userGoalModel
            .find(options)
            .populate({
                path: 'goal',
                populate: {
                    path: 'topics',
                },
            })
            .populate('currentSession')
            .exec();
    }

    async findOne(id: string): Promise<UserGoalDocument> {
        return this.userGoalModel.findById(id).exec();
    }

    async remove(id: string): Promise<UserGoalDocument> {
        return this.userGoalModel.findByIdAndRemove(id);
    }

    async setCurrentSession(userGoalId: string, sessionId: TopicSession): Promise<UserGoalDocument> {
        return this.userGoalModel.findByIdAndUpdate(userGoalId, { currentSession: sessionId } ).exec();
    }
}
