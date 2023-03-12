import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { getModelToken } from '@nestjs/mongoose';
import { Topic } from './entities/topic.schema';
import { Model } from 'mongoose';

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

    it('should be created', function () {
        expect(service).toBeDefined();
    });
});
