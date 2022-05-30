import { Test, TestingModule } from '@nestjs/testing';
import { GoalsService } from './goals.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Goal } from './entities/goal.schema';

describe('GoalsService', () => {
    let service: GoalsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GoalsService,
                {
                    provide: getModelToken(Goal.name),
                    useValue: Model,
                },
            ],
        }).compile();

        service = module.get<GoalsService>(GoalsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
