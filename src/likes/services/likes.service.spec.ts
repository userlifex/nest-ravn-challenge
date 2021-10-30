import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { UsersModule } from '../../users/users.module';
import { AttachmentModule } from '../../attachment/attachment.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { CategoriesModule } from '../../categories/categories.module';
import { SendgridModule } from '../../common/sendgrid/sendgrid.module';
import { ProductsModule } from '../../products/products.module';
import { PrismaService } from '../../prisma/services/prisma.service';

describe('LikesService', () => {
  let likesService: LikesService;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        UsersModule,
        AttachmentModule,
        PrismaModule,
        CategoriesModule,
        SendgridModule,
        ProductsModule,
      ],
      providers: [LikesService],
    }).compile();

    likesService = module.get<LikesService>(LikesService);
    prismaService = module.get<PrismaService>(PrismaService);
    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should be defined', () => {
    expect(likesService).toBeDefined();
  });

  it('should throw an error when like already exists', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'user',
        email: 'user@example.com',
        password: 'password',
      },
    });

    const product = await prismaService.product.create({
      data: {
        name: 'product',
        price: 10,
        stock: 19,
      },
    });

    const like = await likesService.likeProduct(product.id, user.id);

    expect(async () => {
      await likesService.likeProduct(product.id, user.id);
    }).rejects.toThrow();
  });

  it('should create a like', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'user',
        email: 'user@example.com',
        password: 'password',
      },
    });

    const product = await prismaService.product.create({
      data: {
        name: 'product',
        price: 10,
        stock: 19,
      },
    });

    const like = await likesService.likeProduct(product.id, user.id);

    expect(like).toHaveProperty('id');
  });
});
