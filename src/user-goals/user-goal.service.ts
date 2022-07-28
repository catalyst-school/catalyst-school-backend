import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserGoal, UserGoalDocument } from './entities/user-goal.schema';
import { Model } from 'mongoose';
import { CreateUserGoalDto } from './dto/create-user-goal.dto';
import { UpdateUserGoalDto } from './dto/update-user-goal.dto';

@Injectable()
export class UserGoalService {
    constructor(@InjectModel(UserGoal.name) private userGoalModel: Model<UserGoalDocument>) {}

    async create(createUserGoalDto: CreateUserGoalDto): Promise<UserGoal> {
        const createUserGoal = new this.userGoalModel(createUserGoalDto);
        return createUserGoal.save();
    }

    async findAll(): Promise<UserGoal[]> {
        return this.userGoalModel.find().exec();
    }

    async findOne(id: string): Promise<UserGoal> {
        return this.userGoalModel.findById(id).exec();
    }

    async update(id: string, updateUserGoalDto: UpdateUserGoalDto): Promise<UserGoal> {
        return this.userGoalModel.findByIdAndUpdate(id, updateUserGoalDto, { new: true }).exec();
    }

    async  remove(id: string): Promise<UserGoal>  {
        return this.userGoalModel.findByIdAndRemove(id);
    }
}
