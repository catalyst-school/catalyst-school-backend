import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskInstance, TaskInstanceDocument } from './entities/task-instance.schema';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class TaskInstancesService {
    constructor(
        @InjectModel(TaskInstance.name) private model: Model<TaskInstanceDocument>,
        private taskService: TasksService,
    ) {}

    async create(sheetId: number) {
        const taskData = await this.taskService.getTaskData(sheetId);
        const taskInstance = new this.model({ sheetId, ...taskData });
        return taskInstance.save();
    }
}
