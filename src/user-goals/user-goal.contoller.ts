import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserGoal } from './entities/user-goal.schema';
import { UserGoalService } from './user-goal.service';
import { CreateUserGoalDto } from './dto/create-user-goal.dto';
import { UpdateUserGoalDto } from './dto/update-user-goal.dto';

@Controller('user-goal')
@ApiTags()
export class UserGoalController {
    constructor(private readonly userGoalService: UserGoalService) {}

    @Post()
    create(@Body() CreateUserGoalDto: CreateUserGoalDto): Promise<UserGoal> {
        return this.userGoalService.create(CreateUserGoalDto);
    }

    @Post()
    update(@Param('id') id: string, @Body() updateDataDto: UpdateUserGoalDto): Promise<UserGoal> {
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
