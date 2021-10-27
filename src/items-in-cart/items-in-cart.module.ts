import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShopcartsModule } from 'src/shopcarts/shopcarts.module';
import { ShopcartsService } from 'src/shopcarts/shopcarts.service';
import { ItemsInCartController } from './items-in-cart.controller';
import { ItemsInCartService } from './items-in-cart.service';

@Module({
  imports: [PrismaModule, ShopcartsModule],
  controllers: [ItemsInCartController],
  providers: [ItemsInCartService],
})
export class ItemsInCartModule {}
