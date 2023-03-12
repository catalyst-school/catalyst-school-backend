import { Test, TestingModule } from '@nestjs/testing';
import { TopicSessionsService } from './topic-sessions.service';
import { getModelToken } from '@nestjs/mongoose';
import { TopicSession } from './entities/topic-session.schema';
import { createModelMock } from '../../test/utils/create-model-mock';
import { TopicsService } from '../topics/topics.service';
import { TopicsServiceMock } from '../topics/topics.service.mock';
import { TaskInstancesService } from '../task-instances/task-instances.service';
import { TaskInstancesServiceMock } from '../task-instances/task-instances.service.mock';
import { UserGoalServiceMock } from '../user-goals/user-goal.service.mock';
import { UserGoalService } from '../user-goals/user-goal.service';
import { GoalsService } from '../goals/goals.service';
import { GoalsServiceMock } from '../goals/goals.service.mock';
import { TopicSessionStatus } from './entities/topic-session-progress.schema';

describe('TopicSessionsService', () => {
    let service: TopicSessionsService;
    const modelRes = new TopicSession();
    let model = createModelMock(modelRes);
    const userGoalServiceMock = UserGoalServiceMock;
    const goalServiceMock = GoalsServiceMock;
    const topicsServiceMock = TopicsServiceMock;

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
                    useValue: topicsServiceMock,
                },
                {
                    provide: GoalsService,
                    useValue: goalServiceMock,
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
            userGoalServiceMock.findOne.mockResolvedValueOnce(null);
            await expect(service.create('123', { topic: '123', userGoal: '123' })).rejects.toThrow(
                'APP: Unknown user goal',
            );
        });

        it('error: invalid topic', async () => {
            goalServiceMock.findOne.mockResolvedValueOnce({ topics: [] });
            await expect(service.create('123', { topic: '123', userGoal: '123' })).rejects.toThrow(
                'APP: Invalid topic',
            );
        });
    });

    describe('update topic session progress', function () {
        it('error: Unknown topic session', async () => {
            model.findOne().exec.mockResolvedValueOnce(null);
            await expect(service.updateProgress('123', { unitId: '123' })).rejects.toThrow(
                'APP: Unknown topic session',
            );
        });

        it('error: Unknown topic session', async () => {
            topicsServiceMock.findOne.mockResolvedValueOnce(null);
            await expect(service.updateProgress('123', { unitId: '123' })).rejects.toThrow(
                'APP: Unknown topic',
            );
        });

        it('error: Unknown topic unit', async () => {
            topicsServiceMock.findOne.mockResolvedValueOnce({ units: [] });
            await expect(service.updateProgress('123', { unitId: '123' })).rejects.toThrow(
                'APP: Unknown unit',
            );
        });

        it('set next unit id as current', async () => {
            const session: any = {
                save: jest.fn(),
            };
            model.findById().exec.mockResolvedValueOnce(session);
            topicsServiceMock.findOne.mockResolvedValueOnce({
                units: [{ id: 'unit1' }, { id: 'unit2' }],
            });

            await service.updateProgress('123', { unitId: 'unit1' });
            expect(session.progress).toEqual({
                unit: 'unit2',
                status: TopicSessionStatus.Pending,
            });
        });

        it('set topic session as completed', async () => {
            const session: any = {
                save: jest.fn(),
            };
            model.findById().exec.mockResolvedValueOnce(session);
            topicsServiceMock.findOne.mockResolvedValueOnce({ units: [{ id: 'unit1' }] });

            await service.updateProgress('123', { unitId: 'unit1' });
            expect(session.progress).toEqual({
                status: TopicSessionStatus.Completed,
            });
        });
    });
});
