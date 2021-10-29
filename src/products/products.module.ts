import { Module } from '@nestjs/common';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { CategoriesService } from 'src/categories/services/categories.service';
import { SendgridModule } from 'src/common/sendgrid/sendgrid.module';
import { SendgridService } from 'src/common/sendgrid/services/sendgrid.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/services/users.service';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';

@Module({
  imports: [PrismaModule, AttachmentModule, SendgridModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CategoriesService,
    SendgridService,
    UsersService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
