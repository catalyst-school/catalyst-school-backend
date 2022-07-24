import { Injectable } from '@nestjs/common';
import { CreateTopicSessionDto } from './dto/create-topic-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopicSession, TopicSessionDocument } from './entities/topic-session.schema';
import { AppError } from '../shared/models/app-error';

@Injectable()
export class TopicSessionsService {
    constructor(@InjectModel(TopicSession.name) private model: Model<TopicSessionDocument>) {}

    async create(userId, createTopicSessionDto: CreateTopicSessionDto) {
        // todo check that this topic belongs to user's goal
        const oldSession = await this.model
            .findOne({ topic: createTopicSessionDto.topic, user: userId })
            .exec();
        if (oldSession) {
            throw new AppError('App: TopicSession already exists');
        }

        const session = new this.model({ user: userId, ...createTopicSessionDto });
        return session.save();
    }

    findOne(id: string) {
        return this.model.findById(id).exec();
    }
}
