import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGoal, UserGoalSchema } from './entities/user-goal.schema';
import { UserGoalContoller } from './user-goal.contoller';
import { UserGoalService } from './user-goal.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: UserGoal.name, schema: UserGoalSchema }])],
    controllers: [UserGoalContoller],
    providers: [UserGoalService],
})
export class UserGoalModule {}
