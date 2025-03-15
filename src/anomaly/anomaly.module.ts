import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AnomalyService } from './anomaly.service'
import { AnomalyController } from './anomaly.controller'

@Module({
    imports: [PrismaModule],
    providers: [AnomalyService],
    controllers: [AnomalyController]
    //   exports: [WarningService],
})
export class AnomalyModule {}
