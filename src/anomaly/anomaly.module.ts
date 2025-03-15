import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AnomalyService } from './anomaly.service'
import { AnomalyController } from './anomaly.controller'
import { AnimalDataModule } from 'src/animal-data/animal-data.module'
import { AnomalyO3Service } from './anomaly.o3.service'
import { AnomalyOverTimeService } from './anomaly.over-time.service'

@Module({
    imports: [PrismaModule, AnimalDataModule],
    providers: [AnomalyService, AnomalyO3Service, AnomalyOverTimeService],
    controllers: [AnomalyController]
    //   exports: [WarningService],
})
export class AnomalyModule {}
