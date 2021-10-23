import { Module } from '@nestjs/common';
import { ItemsOrderedController } from './items-ordered.controller';
import { ItemsOrderedService } from './items-ordered.service';

@Module({
  controllers: [ItemsOrderedController],
  providers: [ItemsOrderedService],
})
export class ItemsOrderedModule {}
