import { Module } from '@nestjs/common';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { CategoriesService } from 'src/categories/services/categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';

@Module({
  imports: [PrismaModule, AttachmentModule],
  controllers: [ProductsController],
  providers: [ProductsService, CategoriesService],
  exports: [ProductsService],
})
export class ProductsModule {}
