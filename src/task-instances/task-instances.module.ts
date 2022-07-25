import { Module } from '@nestjs/common';
import { TaskInstancesService } from './task-instances.service';
import { MongooseModule } from "@nestjs/mongoose";
import { TaskInstance, TaskInstanceSchema } from "./entities/task-instance.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: TaskInstance.name, schema: TaskInstanceSchema }])],
    providers: [TaskInstancesService]
})
export class TaskInstancesModule {}
