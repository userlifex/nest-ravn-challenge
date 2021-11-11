import { forwardRef, Module } from '@nestjs/common';
import { AttachmentModule } from '../attachment/attachment.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { SendgridModule } from '../common/sendgrid/sendgrid.module';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { CategoriesResolver } from './resolvers/categories.resolver';

@Module({
  imports: [
    PrismaModule,
    AttachmentModule,
    UsersModule,
    SendgridModule,
    forwardRef(() => ProductsModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService, CategoriesResolver],
})
export class CategoriesModule {}
