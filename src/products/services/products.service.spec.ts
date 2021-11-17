import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../../users/users.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AttachmentModule } from '../../attachment/attachment.module';
import { SendgridModule } from '../../common/sendgrid/sendgrid.module';
import { CategoriesModule } from '../../categories/categories.module';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/services/prisma.service';
import { CreateProductDto } from '../dtos/request/create-product.dto';

describe('ProductsService', () => {
  let module: TestingModule;
  let productsService: ProductsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        PrismaModule,
        AttachmentModule,
        SendgridModule,
        CategoriesModule,
        UsersModule,
      ],
      providers: [ProductsService],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
    await module.close();
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  it('should find one by Id', async () => {
    const product = await prismaService.product.create({
      data: {
        name: 'water',
        price: 12,
        stock: 10,
      },
    });

    const searchedProduct = await productsService.findOneById(product.id);

    expect(searchedProduct).toHaveProperty('id');
    expect(searchedProduct.id).toEqual(product.id);
  });

  it('hasAttachment', async () => {
    const product = await prismaService.product.create({
      data: {
        name: 'water',
        price: 12,
        stock: 10,
      },
    });

    const hasAttachment = await productsService.hasAttachment(product.id);
    expect(hasAttachment).toBeFalsy();
  });

  it('hasAttachment', async () => {
    const product = await prismaService.product.create({
      data: {
        name: 'water',
        price: 12,
        stock: 10,
        attachment: {
          create: { key: 's', url: '' },
        },
      },
    });

    const hasAttachment = await productsService.hasAttachment(product.id);
    expect(hasAttachment).toBeTruthy();
  });

  it('should validate stock when is less than stock', async () => {
    const product = await prismaService.product.create({
      data: {
        name: 'water',
        price: 12,
        stock: 10,
      },
    });

    const isValid = await productsService.validateStock(product.id, 9);

    expect(isValid).toBeTruthy();
  });

  it('should validate stock when is great than stock', async () => {
    const product = await prismaService.product.create({
      data: {
        name: 'water',
        price: 12,
        stock: 10,
      },
    });

    const isValid = await productsService.validateStock(product.id, 11);

    expect(isValid).toBeFalsy();
  });

  it('should update a product', async () => {
    const product = await prismaService.product.create({
      data: {
        name: 'product',
        stock: 12,
        price: 10,
      },
    });

    const productUpdate = await productsService.update(product.id, {
      name: 'new',
    });

    expect(productUpdate).toHaveProperty('id');
    expect(productUpdate.name).toBe('new');
  });

  it('should create a product', async () => {
    const product = await productsService.create({
      name: 'product',
      stock: 12,
      price: 10,
    } as CreateProductDto);

    expect(product).toHaveProperty('id');
  });

  it('should delete a product', async () => {
    const product = await productsService.create({
      name: 'product',
      stock: 12,
      price: 10,
    } as CreateProductDto);

    await productsService.delete(product.id);

    const searchedProduct = await prismaService.product.findUnique({
      where: { id: product.id },
      rejectOnNotFound: false,
    });

    expect(searchedProduct).toBeNull();
  });

  it('should get many products', async () => {
    const countProducts = await prismaService.product.createMany({
      data: [
        {
          name: '1',
          price: 12,
          stock: 10,
        },
        {
          name: '2',
          price: 12,
          stock: 10,
        },
        {
          name: '3',
          price: 12,
          stock: 10,
        },
        {
          name: '4',
          price: 12,
          stock: 10,
        },
      ],
    });

    const products = await productsService.find({ page: 1, perPage: 4 });

    expect(products).toHaveProperty('data');
    expect(products).toHaveProperty('pageInfo');
  });
});
