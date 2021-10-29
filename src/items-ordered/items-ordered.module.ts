import { Module } from '@nestjs/common';
import { ItemsOrderedController } from './controllers/items-ordered.controller';
import { ItemsOrderedService } from './services/items-ordered.service';

@Module({
  controllers: [ItemsOrderedController],
  providers: [ItemsOrderedService],
})
export class ItemsOrderedModule {}
