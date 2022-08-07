import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGoal } from './entities/user-goal.schema';
import { UserGoalService } from './user-goal.service';
import { CreateUserGoalDto } from './dto/create-user-goal.dto';
import { UpdateUserGoalDto } from './dto/update-user-goal.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('user-goal')
@ApiTags('user-goal')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class UserGoalController {
    constructor(private readonly userGoalService: UserGoalService) {}

    @Post()
    create(@Req() req: Request, @Body() CreateUserGoalDto: CreateUserGoalDto): Promise<UserGoal> {
        const user = req.user;
        return this.userGoalService.create({...CreateUserGoalDto, user});
    }

    @Put()
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
