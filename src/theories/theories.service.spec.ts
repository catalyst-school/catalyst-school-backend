import { Test, TestingModule } from '@nestjs/testing';
import { TheoriesService } from './theories.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Theory } from './entities/theory.schema';

describe('TheoriesService', () => {
    let service: TheoriesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TheoriesService,
                {
                    provide: getModelToken(Theory.name),
                    useValue: Model,
                },
            ],
        }).compile();

        service = module.get<TheoriesService>(TheoriesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
