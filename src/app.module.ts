import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ItemsInCartModule } from './items-in-cart/items-in-cart.module';
import { ItemsOrderedModule } from './items-ordered/items-ordered.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    UsersModule,
    OrdersModule,
    ItemsInCartModule,
    ItemsOrderedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
