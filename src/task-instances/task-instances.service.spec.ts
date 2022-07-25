import { Test, TestingModule } from '@nestjs/testing';
import { TaskInstancesService } from './task-instances.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskInstance } from './entities/task-instance.schema';

describe('TaskInstancesService', () => {
    let service: TaskInstancesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskInstancesService,
                {
                    provide: getModelToken(TaskInstance.name),
                    useValue: Model,
                },
            ],
        }).compile();

        service = module.get<TaskInstancesService>(TaskInstancesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
