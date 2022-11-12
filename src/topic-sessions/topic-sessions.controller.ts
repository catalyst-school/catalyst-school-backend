import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { TopicSessionsService } from './topic-sessions.service';
import { CreateTopicSessionDto } from './dto/create-topic-session.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { Request } from 'express';
import { UserDocument } from '../users/entities/user.schema';
import { AppError } from '../shared/models/app-error';
import { ValidateAnswersDto } from "./dto/validate-answers.dto";

@Controller('topic-sessions')
@ApiTags('topic-sessions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class TopicSessionsController {
    constructor(private readonly topicSessionsService: TopicSessionsService) {}

    @Post()
    async create(@Body() createTopicSessionDto: CreateTopicSessionDto, @Req() req: Request) {
        const userId = (req.user as UserDocument).id;
        try {
            return await this.topicSessionsService.create(userId, createTopicSessionDto);
        } catch (e) {
            if (e instanceof AppError) {
                if (e.message === 'APP: Unknown user goal')
                    throw new HttpException(e.message, HttpStatus.NOT_FOUND);
            } else throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.topicSessionsService.findOne(id);
    }

    @Post(':id/answers')
    validateAnswers(@Body() validateAnswersDto: ValidateAnswersDto) {
        // return this.topicSessionsService.findOne(id);
        /**
         * todo: validate answers one by one and depending on the type of the section (training|test) and
         *      the amount of right answers change status of current topic session and recalculate progress
         */
    }
}
