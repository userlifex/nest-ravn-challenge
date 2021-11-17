import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from '../users/services/users.service';
import { ShopcartsController } from './controllers/shopcarts.controller';
import { ShopCartResolver } from './resolvers/shopcart.resolver';
import { ShopcartsService } from './services/shopcarts.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShopcartsController],
  providers: [ShopcartsService, ShopCartResolver],
  exports: [ShopcartsService],
})
export class ShopcartsModule {}
