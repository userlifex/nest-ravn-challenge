import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/services/users.service';
import { ShopcartsController } from './controllers/shopcarts.controller';
import { ShopcartsService } from './services/shopcarts.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShopcartsController],
  providers: [ShopcartsService],
  exports: [ShopcartsService],
})
export class ShopcartsModule {}
