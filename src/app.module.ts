import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { WarningModule } from './warning/warning.module';

@Module({
  imports: [DataModule, WarningModule],
})
export class AppModule {}
