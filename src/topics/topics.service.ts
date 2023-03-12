import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { Topic, TopicDocument } from './entities/topic.schema';
import { TopicSection, TopicSectionType } from './entities/topic-section.schema';
import { AppError } from '../shared/models/app-error';

@Injectable()
export class TopicsService {
    constructor(@InjectModel(Topic.name) private topicModel: Model<TopicDocument>) {}

    async create(createTopicDto: CreateTopicDto): Promise<Topic> {
        // todo validate section and unit type
        const createdTopic = new this.topicModel(createTopicDto);
        return createdTopic.save();
    }

    async findAll() {
        return this.topicModel.find().exec();
    }

    async findOne(id: string, populate?: PopulateOptions): Promise<TopicDocument> {
        return this.topicModel.findById(id).populate(populate).exec();
    }

    async update(id: string, updateTopicDto: UpdateTopicDto) {
        // todo validate section and unit type
        return this.topicModel.findByIdAndUpdate(id, updateTopicDto, { new: true }).exec();
    }

    async remove(id: string) {
        return this.topicModel.findByIdAndRemove(id);
    }
}
