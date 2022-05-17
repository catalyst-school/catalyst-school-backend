import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from './entities/topic.schema';
import { TopicSection, TopicSectionType } from './entities/topic-section.schema';
import { AppError } from "../shared/models/app-error";

@Injectable()
export class TopicsService {
    constructor(@InjectModel(Topic.name) private topicModel: Model<TopicDocument>) {}

    async create(createTopicDto: CreateTopicDto): Promise<Topic> {
        for (let section of createTopicDto.sections) {
            this.validateSectionType(section);
        }
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
        for (let section of updateTopicDto.sections) {
            this.validateSectionType(section);
        }
        return this.topicModel.findByIdAndUpdate(id, updateTopicDto);
    }

    async remove(id: string) {
        return this.topicModel.findByIdAndRemove(id);
    }

    // todo catch this error
    private validateSectionType(section: TopicSection): void {
        if (section.type === TopicSectionType.THEORY && section.tasks?.length)
            throw new AppError("APP: sections with type 'Theory' can't have tasks");

        if (section.type === TopicSectionType.TRAINING && section.theories?.length)
            throw new AppError("APP: sections with type 'Training' can't have theories");

        if (section.type === TopicSectionType.TEST && section.theories?.length)
            throw new AppError("APP: sections with type 'Test' can't have theories");
    }
}
