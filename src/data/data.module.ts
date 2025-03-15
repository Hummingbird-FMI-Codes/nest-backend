import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DataController } from './data.controller';

@Module({
  imports: [PrismaModule],
  providers: [DataService],
  controllers: [DataController],
  exports: [DataService],
})
export class DataModule {}
