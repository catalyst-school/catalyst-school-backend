import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { Goal, GoalDocument } from './entities/goal.schema';

@Injectable()
export class GoalsService {
    constructor(@InjectModel(Goal.name) private goalModel: Model<GoalDocument>) {}

    async create(createGoalDto: CreateGoalDto) {
        const newGoal = new this.goalModel(createGoalDto);
        return newGoal.save();
    }

    async findAll() {
        return this.goalModel.find().exec();
    }

    async findOne(id: string, populate?: PopulateOptions) {
        return this.goalModel.findById(id).populate(populate).exec();
    }

    async update(id: string, updateGoalDto: UpdateGoalDto) {
        return this.goalModel
            .findByIdAndUpdate(id, updateGoalDto, { new: true })
            .populate('topics')
            .exec();
    }

    async remove(id: string) {
        return this.goalModel.findByIdAndDelete(id).exec();
    }
}
