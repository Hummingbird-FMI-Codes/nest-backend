import { Module } from '@nestjs/common'
import { DataModule } from './data/data.module'
import { AnomalyModule } from './anomaly/anomaly.module'

@Module({
    imports: [DataModule, AnomalyModule]
})
export class AppModule {}
