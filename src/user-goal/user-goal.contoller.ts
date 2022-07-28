import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserGoal } from './entities/user-goal.schema';
import { UserGoalService } from './user-goal.service';

@Controller('user-goal')
@ApiTags()
export class UserGoalContoller {
    constructor(private readonly userGoalService: UserGoalService) {}

    @Post()
    create(@Body() createDataDto): Promise<UserGoal> {
        return this.userGoalService.create(createDataDto);
    }

    @Post()
    update(id: string, updateDataDto): Promise<UserGoal> {
        return this.userGoalService.update(id, updateDataDto);
    }

    @Get()
    getAll(): Promise<UserGoal[]> {
        return this.userGoalService.findAll();
    }

    @Get(':id')
    getById(@Param('id') id: string): Promise<UserGoal> {
        return this.userGoalService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<UserGoal>  {
        return this.userGoalService.remove(id);
    }
}
