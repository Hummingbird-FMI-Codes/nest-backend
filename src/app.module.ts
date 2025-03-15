import { Module } from '@nestjs/common'
import { AnimalDataModule } from './animal-data/animal-data.module'
import { AnomalyModule } from './anomaly/anomaly.module'

@Module({
    imports: [AnimalDataModule, AnomalyModule]
})
export class AppModule {}
