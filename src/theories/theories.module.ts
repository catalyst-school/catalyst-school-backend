import { Module } from '@nestjs/common';
import { TheoriesService } from './theories.service';
import { TheoriesController } from './theories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Theory, TheorySchema } from './entities/theory.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Theory.name, schema: TheorySchema }])],
    controllers: [TheoriesController],
    providers: [TheoriesService],
})
export class TheoriesModule {}
