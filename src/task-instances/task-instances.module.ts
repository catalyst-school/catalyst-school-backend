import { forwardRef, Module } from '@nestjs/common';
import { TaskInstancesService } from './task-instances.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskInstance, TaskInstanceSchema } from './entities/task-instance.schema';
import { TasksModule } from '../tasks/tasks.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TaskInstance.name, schema: TaskInstanceSchema }]),
        forwardRef(() => TasksModule),
    ],
    providers: [TaskInstancesService],
    exports: [TaskInstancesService],
})
export class TaskInstancesModule {}
