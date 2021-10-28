import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
  providers: [LikesService, ProductsService, PrismaService, CategoriesService],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
