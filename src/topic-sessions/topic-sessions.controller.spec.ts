import { Test, TestingModule } from '@nestjs/testing';
import { TopicSessionsController } from './topic-sessions.controller';
import { TopicSessionsService } from './topic-sessions.service';

describe('TopicSessionsController', () => {
    let controller: TopicSessionsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TopicSessionsController],
            providers: [TopicSessionsService],
        }).compile();

        controller = module.get<TopicSessionsController>(TopicSessionsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
