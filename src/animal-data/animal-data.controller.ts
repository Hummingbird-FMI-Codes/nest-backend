import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { AnimalDataService } from './animal-data.service'
import { CreateAnimalDataDTO } from './DTOs/create-animal-data.dto'

@Controller('animal-data')
export class AnimalDataController {
    constructor(private readonly dataService: AnimalDataService) {}

    @Post()
    create(@Body() createDataDTO: CreateAnimalDataDTO) {
        return this.dataService.create(createDataDTO)
    }

    @Get()
    findAll() {
        return this.dataService.findAll()
    }

    @Get('range')
    findRange(
        @Query('startDate') startData: Date,
        @Query('endDate') endData: Date
    ) {
        return this.dataService.findRange(startData, endData)
    }
}
