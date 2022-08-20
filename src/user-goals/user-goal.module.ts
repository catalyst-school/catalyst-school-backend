import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGoal, UserGoalSchema } from './entities/user-goal.schema';
import { UserGoalController } from './user-goal.contoller';
import { UserGoalService } from './user-goal.service';
import { GoalsModule } from "../goals/goals.module";

@Module({
    imports: [MongooseModule.forFeature([{ name: UserGoal.name, schema: UserGoalSchema }]), GoalsModule],
    controllers: [UserGoalController],
    providers: [UserGoalService],
})
export class UserGoalModule {}
