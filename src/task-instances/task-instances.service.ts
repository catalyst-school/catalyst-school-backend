import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskInstance, TaskInstanceDocument } from './entities/task-instance.schema';

@Injectable()
export class TaskInstancesService {
    constructor(@InjectModel(TaskInstance.name) private model: Model<TaskInstanceDocument>) {}
}
