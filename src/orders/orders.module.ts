import { Module } from '@nestjs/common';
import { AttachmentModule } from '../attachment/attachment.module';
import { CategoriesModule } from '../categories/categories.module';
import { SendgridModule } from '../common/sendgrid/sendgrid.module';
import { ItemsInCartModule } from '../items-in-cart/items-in-cart.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { ShopcartsModule } from '../shopcarts/shopcarts.module';
import { UsersModule } from '../users/users.module';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrderResolver } from './resolvers/order.resolver';
import { ItemsOrderedModule } from '../items-ordered/items-ordered.module';

@Module({
  imports: [
    PrismaModule,
    AttachmentModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    ItemsInCartModule,
    ShopcartsModule,
    ItemsOrderedModule,
    SendgridModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderResolver],
})
export class OrdersModule {}
