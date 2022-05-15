import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from './entities/topic.schema';

@Injectable()
export class TopicsService {
    constructor(@InjectModel(Topic.name) private topicModel: Model<TopicDocument>) {}

    async create(createTopicDto: CreateTopicDto): Promise<Topic> {
        const createdTopic = new this.topicModel(createTopicDto);
        return createdTopic.save();
    }

    async findAll() {
        return this.topicModel.find().exec();
    }

    async findOne(id: string) {
        return this.topicModel.findById(id).exec();
    }

    async update(id: string, updateTopicDto: UpdateTopicDto) {
        return this.topicModel.findByIdAndUpdate(id, updateTopicDto);
    }

    async remove(id: string) {
        return this.topicModel.findByIdAndRemove(id);
    }
}
