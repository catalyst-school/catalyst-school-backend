import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Goal, GoalSchema } from './entities/goal.schema';
import { FilesModule } from '../files/files.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]), FilesModule],
    controllers: [GoalsController],
    providers: [GoalsService],
    exports: [GoalsService],
})
export class GoalsModule {}
