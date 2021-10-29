import { Module } from '@nestjs/common';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { CategoriesService } from 'src/categories/services/categories.service';
import { SengridModule } from 'src/common/sengrid/sengrid.module';
import { SengridService } from 'src/common/sengrid/sengrid.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/services/users.service';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';

@Module({
  imports: [PrismaModule, AttachmentModule, SengridModule],
  controllers: [ProductsController],
  providers: [ProductsService, CategoriesService, SengridService, UsersService],
  exports: [ProductsService],
})
export class ProductsModule {}
