import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from '../users/services/users.service';
import { ShopcartsController } from './controllers/shopcarts.controller';
import { ShopcartsService } from './services/shopcarts.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShopcartsController],
  providers: [ShopcartsService],
  exports: [ShopcartsService],
})
export class ShopcartsModule {}
