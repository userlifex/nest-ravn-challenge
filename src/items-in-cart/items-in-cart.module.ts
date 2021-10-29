import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';
import { ShopcartsModule } from 'src/shopcarts/shopcarts.module';
import { ItemsInCartController } from './items-in-cart.controller';
import { ItemsInCartService } from './items-in-cart.service';

@Module({
  imports: [PrismaModule, ShopcartsModule, ProductsModule],
  controllers: [ItemsInCartController],
  providers: [ItemsInCartService],
})
export class ItemsInCartModule {}
