import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Controller('achievements')
@ApiTags('achievements')
export class AchievementsController {
    constructor(private achievementService: AchievementsService) {}

    @Get()
    findAll() {
        return this.achievementService.findAll();
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.achievementService.getById(id);
    }

    @Post()
    create(@Body() createAchievementDto: CreateAchievementDto) {
        return this.achievementService.create(createAchievementDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAchievement: UpdateAchievementDto) {
        return this.achievementService.update(id, updateAchievement);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.achievementService.remove(id);
    }
}
