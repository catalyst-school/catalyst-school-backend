import { Test, TestingModule } from '@nestjs/testing';
import { TopicSessionsService } from './topic-sessions.service';
import { getModelToken } from '@nestjs/mongoose';
import { TopicSession } from './entities/topic-session.schema';
import { createModelMock } from '../../test/utils/create-model-mock';
import { TopicsService } from '../topics/topics.service';
import { TopicsServiceMock } from '../topics/topics.service.mock';
import { TaskInstancesService } from '../task-instances/task-instances.service';
import { TaskInstancesServiceMock } from '../task-instances/task-instances.service.mock';
import { UserGoalServiceMock } from "../user-goals/user-goal.service.mock";
import { UserGoalService } from "../user-goals/user-goal.service";

describe('TopicSessionsService', () => {
    let service: TopicSessionsService;
    let modelRes = new TopicSession();
    let model = createModelMock(modelRes);
    const userGoalServiceMock = UserGoalServiceMock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TopicSessionsService,
                {
                    provide: UserGoalService,
                    useValue: userGoalServiceMock,
                },
                {
                    provide: TaskInstancesService,
                    useValue: TaskInstancesServiceMock,
                },
                {
                    provide: TopicsService,
                    useValue: TopicsServiceMock,
                },
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
        it('error: unknown goal', async () => {
            userGoalServiceMock.findOne.mockResolvedValue(null);
            await expect(service.create('123', { topic: '123', userGoal: '123' })).rejects.toThrow(
                'APP: Unknown user goal',
            );
        });
    });
});
