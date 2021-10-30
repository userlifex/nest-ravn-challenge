import { Module } from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { LikesController } from './controllers/likes.controller';
import { PrismaService } from '../prisma/services/prisma.service';
import { ProductsService } from '../products/services/products.service';
import { CategoriesService } from '../categories/services/categories.service';
import { AttachmentService } from '../attachment/services/attachment.service';
import { UsersService } from '../users/services/users.service';
import { UsersModule } from '../users/users.module';
import { SendgridService } from '../common/sendgrid/services/sendgrid.service';

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
