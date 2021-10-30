import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../../users/users.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AttachmentModule } from '../../attachment/attachment.module';
import { SendgridModule } from '../../common/sendgrid/sendgrid.module';
import { CategoriesModule } from '../../categories/categories.module';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        AttachmentModule,
        SendgridModule,
        CategoriesModule,
        UsersModule,
      ],
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
