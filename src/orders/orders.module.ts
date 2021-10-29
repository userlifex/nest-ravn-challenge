import { Module } from '@nestjs/common';
import { AttachmentService } from 'src/attachment/services/attachment.service';
import { CategoriesService } from 'src/categories/services/categories.service';
import { SendgridService } from 'src/common/sendgrid/services/sendgrid.service';
import { ItemsInCartService } from 'src/items-in-cart/services/items-in-cart.service';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { ProductsService } from 'src/products/services/products.service';
import { ShopcartsService } from 'src/shopcarts/services/shopcarts.service';
import { UsersService } from 'src/users/services/users.service';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    AttachmentService,
    UsersService,
    ProductsService,
    CategoriesService,
    ItemsInCartService,
    ShopcartsService,
    SendgridService,
  ],
})
export class OrdersModule {}
