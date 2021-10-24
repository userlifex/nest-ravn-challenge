import { Module } from '@nestjs/common';
import { ItemsInCartController } from './items-in-cart.controller';
import { ItemsInCartService } from './items-in-cart.service';

@Module({
  controllers: [ItemsInCartController],
  providers: [ItemsInCartService],
})
export class ItemsInCartModule {}
