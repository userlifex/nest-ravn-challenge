import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CategoriesModule } from './categories/categories.module';
import { RolesGuard } from './common/guards/role.guard';
import { ItemsInCartModule } from './items-in-cart/items-in-cart.module';
import { ItemsOrderedModule } from './items-ordered/items-ordered.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { ShopcartsModule } from './shopcarts/shopcarts.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { AttachmentModule } from './attachment/attachment.module';
import { LikesModule } from './likes/likes.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CategoriesModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    ItemsInCartModule,
    ItemsOrderedModule,
    PrismaModule,
    TokensModule,
    ShopcartsModule,
    AttachmentModule,
    LikesModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,

      context: ({ req, res, payload, connection }) => ({
        req,
        res,
        payload,
        connection,
      }),
    }),
  ],
  controllers: [],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
