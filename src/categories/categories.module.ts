import { Module } from '@nestjs/common';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { AttachmentService } from 'src/attachment/services/attachment.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsService } from 'src/products/services/products.service';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';

@Module({
  imports: [PrismaModule, AttachmentModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, ProductsService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
