import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { DataService } from './data.service'
import { CreateDataDTO } from './DTOs/create-data.dto'

@Controller('data')
export class DataController {
    constructor(private readonly dataService: DataService) {}

    @Post()
    create(@Body() createDataDTO: CreateDataDTO) {
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
