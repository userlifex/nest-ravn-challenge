import { Module } from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { LikesController } from './controllers/likes.controller';
import { UsersModule } from '../users/users.module';
import { AttachmentModule } from '../attachment/attachment.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoriesModule } from '../categories/categories.module';
import { SendgridModule } from '../common/sendgrid/sendgrid.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    UsersModule,
    AttachmentModule,
    PrismaModule,
    CategoriesModule,
    SendgridModule,
    ProductsModule,
  ],
  providers: [LikesService],
  controllers: [LikesController],
  exports: [LikesService],
})
export class LikesModule {}
