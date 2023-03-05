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
import { CheckUnitDto } from './dto/check-unit.dto';

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

    @Post(':id/check-unit')
    async checkUnit(
        @Body() checkUnitDto: CheckUnitDto,
        @Req() req: Request,
        @Param('id') id: string,
    ) {
        const session = await this.topicSessionsService.findOne(id);
        if (!session) throw new HttpException('APP: Unknown topic session', HttpStatus.NOT_FOUND);

        const userId = (req.user as UserDocument).id;
        if (session.user.toString() !== userId)
            throw new HttpException('APP: Access denied', HttpStatus.FORBIDDEN);

        try {
            return await this.topicSessionsService.checkUnit(session._id, checkUnitDto);
        } catch (e) {
            // todo handle errors
            if (e instanceof AppError) {
                if (e.message === 'APP: Unknown user goal')
                    throw new HttpException(e.message, HttpStatus.NOT_FOUND);
            } else throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
