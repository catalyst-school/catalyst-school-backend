import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Achievement, AchievementsSchema } from './entities/achievements.schema';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Achievement.name, schema: AchievementsSchema }])],
    controllers: [AchievementsController],
    providers: [AchievementsService],
    exports: [AchievementsService],
})
export class AchievementsModule {}
