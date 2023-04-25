import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AchievementsService } from '../achievements.service';
import { Achievement } from '../entities/achievements.schema';

describe('AchievementsService', () => {
    let service: AchievementsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AchievementsService,
                {
                    provide: getModelToken(Achievement.name),
                    useValue: Model,
                },
            ],
        }).compile();

        service = module.get<AchievementsService>(AchievementsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
