import { Injectable } from '@nestjs/common';
import { CreateTheoryDto } from './dto/create-theory.dto';
import { UpdateTheoryDto } from './dto/update-theory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Theory, TheoryDocument } from './entities/theory.schema';
import { Model } from 'mongoose';

@Injectable()
export class TheoriesService {
    constructor(@InjectModel(Theory.name) private theoryModel: Model<TheoryDocument>) {}

    async create(createTheoryDto: CreateTheoryDto): Promise<Theory> {
        const createdTheory = new this.theoryModel(createTheoryDto);
        return createdTheory.save();
    }

    async findAll(): Promise<Theory[]> {
        return this.theoryModel.find().exec();
    }

    async findOne(id: string): Promise<Theory> {
        return this.theoryModel.findById(id).exec();
    }

    async update(id: string, updateTheoryDto: UpdateTheoryDto): Promise<Theory> {
        return this.theoryModel.findByIdAndUpdate(id, updateTheoryDto, { new: true }).exec();
    }

    async remove(id: string): Promise<Theory> {
        return this.theoryModel.findByIdAndRemove(id);
    }
}
