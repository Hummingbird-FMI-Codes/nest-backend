import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WarningService } from './warning.service';

@Module({
  imports: [PrismaModule],
  providers: [WarningService],
  //   exports: [WarningService],
})
export class WarningModule {}
