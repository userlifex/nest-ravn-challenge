import { Module } from '@nestjs/common';
import { SengridService } from './sengrid.service';

@Module({
  providers: [SengridService],
  exports: [SengridService],
})
export class SengridModule {}
