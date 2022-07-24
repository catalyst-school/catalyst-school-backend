import { Test, TestingModule } from '@nestjs/testing';
import { TopicSessionsService } from './topic-sessions.service';

describe('TopicSessionsService', () => {
    let service: TopicSessionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TopicSessionsService],
        }).compile();

        service = module.get<TopicSessionsService>(TopicSessionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
