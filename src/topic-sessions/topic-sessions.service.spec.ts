import { Test, TestingModule } from '@nestjs/testing';
import { TopicSessionsService } from './topic-sessions.service';
import { getModelToken } from '@nestjs/mongoose';
import { TopicSession } from './entities/topic-session.schema';
import { createModelMock } from '../../test/utils/create-model-mock';

describe('TopicSessionsService', () => {
    let service: TopicSessionsService;
    let modelRes = new TopicSession();
    let model = createModelMock(modelRes);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TopicSessionsService,
                {
                    provide: getModelToken(TopicSession.name),
                    useValue: model,
                },
            ],
        }).compile();

        service = module.get<TopicSessionsService>(TopicSessionsService);
        model = module.get(getModelToken(TopicSession.name)) as any;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create topic session', function () {
        it('error: existing user', async () => {
            await expect(service.create('123', { topic: '123' })).rejects.toThrow(
                'App: TopicSession already exists',
            );
        });
    });
});
