import { Module } from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { LikesController } from './controllers/likes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/services/products.service';
import { CategoriesService } from 'src/categories/services/categories.service';
import { AttachmentService } from 'src/attachment/services/attachment.service';

@Module({
  providers: [
    AttachmentService,
    LikesService,
    ProductsService,
    PrismaService,
    CategoriesService,
  ],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
