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
import { PrismaModule } from './prisma/prisma.module';
import { TokensModule } from './tokens/tokens.module';
import { APP_GUARD, RouterModule, Routes } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/role.guard';
import { ShopcartsModule } from './shopcarts/shopcarts.module';

const route: Routes = [
  {
    path: '/users',
    module: UsersModule,
    children: [
      {
        path: '/me/shopcart',
        module: ShopcartsModule,
      },
      {
        path: '/me/shopcart/items-in-cart',
        module: ItemsInCartModule,
      },
    ],
  },
  // {
  //   path: '/products',
  //   module: ProductsModule,
  //   children: [
  //     {
  //       path: '/:productId/items-in-cart',
  //       module: ItemsInCartModule,
  //     },
  //   ],
  // },
];

@Module({
  imports: [
    RouterModule.register(route),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    UsersModule,
    OrdersModule,
    ItemsInCartModule,
    ItemsOrderedModule,
    PrismaModule,
    TokensModule,
    ShopcartsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
