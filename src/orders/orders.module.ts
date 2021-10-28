import { Module } from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { ItemsInCartService } from 'src/items-in-cart/items-in-cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import {ShopcartsService} from 'src/shopcarts/services/shopcarts.service';
import { UsersService } from 'src/users/services/users.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    UsersService,
    ProductsService,
    CategoriesService,
    ItemsInCartService,
    ShopcartsService
  ],
})
export class OrdersModule {}
