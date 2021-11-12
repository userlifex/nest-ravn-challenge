import { forwardRef, Module } from '@nestjs/common';
import { AttachmentModule } from '../attachment/attachment.module';
import { CategoriesModule } from '../categories/categories.module';
import { SendgridModule } from '../common/sendgrid/sendgrid.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ProductsController } from './controllers/products.controller';
import { ProductResolver } from './resolvers/product.resolver';
import { ProductsService } from './services/products.service';

@Module({
  imports: [
    PrismaModule,
    AttachmentModule,
    SendgridModule,
    UsersModule,
    forwardRef(() => CategoriesModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductResolver],
  exports: [ProductsService, ProductResolver],
})
export class ProductsModule {}
