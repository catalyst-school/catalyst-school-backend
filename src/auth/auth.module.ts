import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.schema';

@Module({
    imports: [UsersModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
