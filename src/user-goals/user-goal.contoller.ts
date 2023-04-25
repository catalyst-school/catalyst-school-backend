import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGoal } from './entities/user-goal.schema';
import { FilterOptions, UserGoalService } from './user-goal.service';
import { CreateUserGoalDto } from './dto/create-user-goal.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { Request } from 'express';
import { UserDocument } from '../users/entities/user.schema';
import { AppError } from '../shared/models/app-error';

@Controller('user-goal')
@ApiTags('user-goal')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class UserGoalController {
    constructor(private readonly userGoalService: UserGoalService) {}

    @Post()
    async create(
        @Req() req: Request,
        @Body() createUserGoalDto: CreateUserGoalDto,
    ): Promise<UserGoal> {
        const user = req.user;
        try {
            return await this.userGoalService.create({ ...createUserGoalDto, user: user['_id'] });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.message === 'APP: Goal not found')
                    throw new HttpException(e.message, HttpStatus.NOT_FOUND);
            } else throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    getAll(@Req() req: Request): Promise<UserGoal[]> {
        const options: FilterOptions = { user: (req.user as UserDocument)._id };
        return this.userGoalService.findAll(options);
    }

    @Get(':id')
    getById(@Param('id') id: string): Promise<UserGoal> {
        return this.userGoalService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<UserGoal> {
        return this.userGoalService.remove(id);
    }
}
