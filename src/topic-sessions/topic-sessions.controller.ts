import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TopicSessionsService } from './topic-sessions.service';
import { CreateTopicSessionDto } from './dto/create-topic-session.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { Request } from 'express';
import { UserDocument } from '../users/entities/user.schema';

@Controller('topic-sessions')
@ApiTags('topic-sessions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class TopicSessionsController {
    constructor(private readonly topicSessionsService: TopicSessionsService) {}

    @Post()
    create(@Body() createTopicSessionDto: CreateTopicSessionDto, @Req() req: Request) {
        const userId = (req.user as UserDocument).id;
        return this.topicSessionsService.create(userId, createTopicSessionDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.topicSessionsService.findOne(id);
    }
}
