import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { ShopcartsController } from './shopcarts.controller';
import { ShopcartsService } from './shopcarts.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShopcartsController],
  providers: [ShopcartsService],
  exports: [ShopcartsService],
})
export class ShopcartsModule {}
