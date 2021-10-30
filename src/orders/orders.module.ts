import { Module } from '@nestjs/common';
import { AttachmentService } from '../attachment/services/attachment.service';
import { CategoriesService } from '../categories/services/categories.service';
import { SendgridService } from '../common/sendgrid/services/sendgrid.service';
import { ItemsInCartService } from '../items-in-cart/services/items-in-cart.service';
import { PrismaService } from '../prisma/services/prisma.service';
import { ProductsService } from '../products/services/products.service';
import { ShopcartsService } from '../shopcarts/services/shopcarts.service';
import { UsersService } from '../users/services/users.service';
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
