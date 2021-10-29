import { Module } from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { LikesController } from './controllers/likes.controller';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { ProductsService } from 'src/products/services/products.service';
import { CategoriesService } from 'src/categories/services/categories.service';
import { AttachmentService } from 'src/attachment/services/attachment.service';
import { UsersService } from 'src/users/services/users.service';
import { UsersModule } from 'src/users/users.module';
import { SendgridService } from 'src/common/sendgrid/services/sendgrid.service';

@Module({
  imports: [UsersModule],
  providers: [
    AttachmentService,
    LikesService,
    ProductsService,
    PrismaService,
    CategoriesService,
    UsersService,
    SendgridService,
  ],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
