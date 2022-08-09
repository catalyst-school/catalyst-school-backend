import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserGoal } from './entities/user-goal.schema';
import { UserGoalService } from './user-goal.service';

describe('UserGoalService', () => {
    let service: UserGoalService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserGoalService,
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
});
