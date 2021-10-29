import { Module } from '@nestjs/common';
import { AttachmentModule } from '../attachment/attachment.module';
import { CategoriesModule } from '../categories/categories.module';
import { SendgridModule } from '../common/sendgrid/sendgrid.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';

@Module({
  imports: [
    PrismaModule,
    AttachmentModule,
    SendgridModule,
    CategoriesModule,
    UsersModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
