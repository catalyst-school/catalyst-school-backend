import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Achievement, AchievementDocument } from './entities/achievements.schema';
import { Model } from 'mongoose';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Injectable()
export class AchievementsService {
    constructor(
        @InjectModel(Achievement.name) private achievementModel: Model<AchievementDocument>,
    ) {}

    async findAll() {
        return this.achievementModel.find().exec();
    }

    async getById(id: string) {
        return this.achievementModel.findById(id).populate(['goals', 'topics']).exec();
    }

    async create(createAchievementDto: CreateAchievementDto) {
        const achievement = new this.achievementModel(createAchievementDto);
        return achievement.save();
    }

    async update(id: string, updateAchievementDto: UpdateAchievementDto) {
        return this.achievementModel
            .findByIdAndUpdate(id, updateAchievementDto, { new: true })
            .exec();
    }

    async remove(id: string) {
        return this.achievementModel.findByIdAndDelete(id).exec();
    }
}
