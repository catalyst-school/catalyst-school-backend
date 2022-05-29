import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags } from "@nestjs/swagger";

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getAll(): Promise<any> {
        return this.tasksService.findAll();
    }
}
