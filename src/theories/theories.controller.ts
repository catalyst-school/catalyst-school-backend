import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TheoriesService } from './theories.service';
import { CreateTheoryDto } from './dto/create-theory.dto';
import { UpdateTheoryDto } from './dto/update-theory.dto';

@Controller('theories')
export class TheoriesController {
    constructor(private readonly theoriesService: TheoriesService) {}

    @Post()
    create(@Body() createTheoryDto: CreateTheoryDto) {
        return this.theoriesService.create(createTheoryDto);
    }

    @Get()
    findAll() {
        return this.theoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.theoriesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTheoryDto: UpdateTheoryDto) {
        return this.theoriesService.update(id, updateTheoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.theoriesService.remove(id);
    }
}
