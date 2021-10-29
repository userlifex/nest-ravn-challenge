import { Module } from '@nestjs/common';
import { AttachmentModule } from '../attachment/attachment.module';
import { AttachmentService } from '../attachment/services/attachment.service';
import { SendgridService } from '../common/sendgrid/sendgrid.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsService } from '../products/services/products.service';
import { UsersService } from '../users/services/users.service';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';

@Module({
  imports: [PrismaModule, AttachmentModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    ProductsService,
    UsersService,
    SendgridService,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
