import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { getModelToken } from '@nestjs/mongoose';
import { Topic } from './entities/topic.schema';
import { Model } from 'mongoose';
import { TopicSectionType } from './entities/topic-section.schema';

describe('TopicsService', () => {
    let service: TopicsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TopicsService,
                {
                    provide: getModelToken(Topic.name),
                    useValue: Model,
                },
            ],
        }).compile();

        service = module.get<TopicsService>(TopicsService);
    });

    describe('create topic', function () {
        it('error: theory section should not have tasks', async () => {
            await expect(
                service.create({
                    title: 'title',
                    sections: [{ type: TopicSectionType.THEORY, tasks: [{}] as any }],
                }),
            ).rejects.toThrow("APP: sections with type 'Theory' can't have tasks");
        });

        it('error: test section should not have theories', async () => {
            await expect(
                service.create({
                    title: 'title',
                    sections: [{ type: TopicSectionType.TEST, theories: [{}] as any }],
                }),
            ).rejects.toThrow("APP: sections with type 'Test' can't have theories");
        });

        it('error: training section should not have theories', async () => {
            await expect(
                service.create({
                    title: 'title',
                    sections: [{ type: TopicSectionType.TRAINING, theories: [{}] as any }],
                }),
            ).rejects.toThrow("APP: sections with type 'Training' can't have theories");
        });
    });

    describe('update topic', function () {
        it('error: theory section should not have tasks', async () => {
            await expect(
                service.update('123', {
                    title: 'title',
                    sections: [{ type: TopicSectionType.THEORY, tasks: [{}] as any }],
                }),
            ).rejects.toThrow("APP: sections with type 'Theory' can't have tasks");
        });

        it('error: test section should not have theories', async () => {
            await expect(
                service.update('123', {
                    title: 'title',
                    sections: [{ type: TopicSectionType.TEST, theories: [{}] as any }],
                }),
            ).rejects.toThrow("APP: sections with type 'Test' can't have theories");
        });

        it('error: training section should not have theories', async () => {
            await expect(
                service.update('123', {
                    title: 'title',
                    sections: [{ type: TopicSectionType.TRAINING, theories: [{}] as any }],
                }),
            ).rejects.toThrow("APP: sections with type 'Training' can't have theories");
        });
    });
});
