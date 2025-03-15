import { Module } from '@nestjs/common'
import { AnimalDataService } from './animal-data.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AnimalDataController } from './animal-data.controller'

@Module({
    imports: [PrismaModule],
    providers: [AnimalDataService],
    controllers: [AnimalDataController],
    exports: [AnimalDataService]
})
export class AnimalDataModule {}
