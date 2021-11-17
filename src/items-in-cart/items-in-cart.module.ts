import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { ShopcartsModule } from '../shopcarts/shopcarts.module';
import { ItemsInCartController } from './controllers/items-in-cart.controller';
import { ItemsInCartResolver } from './resolvers/items-in-cart.resolver';
import { ItemsInCartService } from './services/items-in-cart.service';

@Module({
  imports: [PrismaModule, ShopcartsModule, ProductsModule],
  controllers: [ItemsInCartController],
  providers: [ItemsInCartService, ItemsInCartResolver],
  exports: [ItemsInCartService],
})
export class ItemsInCartModule {}
