import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserGoal } from './entities/user-goal.schema';
import { UserGoalService } from './user-goal.service';
import { GoalsService } from '../goals/goals.service';
import { GoalsServiceMock } from '../goals/goals.service.mock';

describe('UserGoalService', () => {
    let service: UserGoalService;
    let goalServiceMock = GoalsServiceMock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserGoalService,
                {
                    provide: GoalsService,
                    useValue: goalServiceMock,
                },
                {
                    provide: getModelToken(UserGoal.name),
                    useValue: Model,
                },
            ],
        }).compile();

        service = module.get<UserGoalService>(UserGoalService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('with error: goal not found', async () => {
            goalServiceMock.findOne.mockResolvedValue(undefined);
            await expect(service.create({ goal: '123', user: 'user' })).rejects.toThrow(
                "APP: Goal not found",
            );
        });
    });
});
