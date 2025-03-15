import { Injectable } from '@nestjs/common'
import { DataService } from 'src/data/data.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AnomalyService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly dataService: DataService
    ) {}

    async detectAnomalies(startDate: Date, endDate: Date) {
        const data = await this.dataService.findRange(startDate, endDate)
    }
}
