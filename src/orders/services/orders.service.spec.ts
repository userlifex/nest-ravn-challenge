import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';

import { AttachmentModule } from '../../attachment/attachment.module';
import { CategoriesModule } from '../../categories/categories.module';
import { SendgridModule } from '../../common/sendgrid/sendgrid.module';
import { ItemsInCartModule } from '../../items-in-cart/items-in-cart.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProductsModule } from '../../products/products.module';
import { ShopcartsModule } from '../../shopcarts/shopcarts.module';
import { UsersModule } from '../../users/users.module';
import { PrismaService } from '../../prisma/services/prisma.service';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        PrismaModule,
        AttachmentModule,
        UsersModule,
        ProductsModule,
        CategoriesModule,
        ItemsInCartModule,
        ShopcartsModule,
        SendgridModule,
      ],
      providers: [OrdersService],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    prismaService.clearDatabase();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  it('should return all the orders', async () => {
    const user1 = await prismaService.user.create({
      data: { name: 'jon', email: 'jon@mail.co', password: '12345678' },
    });
    const user2 = await prismaService.user.create({
      data: { name: 'jon', email: 'jo1n@mail.co', password: '12345678' },
    });

    const orders = await prismaService.order.createMany({
      data: [
        {
          total: 100,
          userId: user1.id,
        },
        {
          total: 101,
          userId: user2.id,
        },
        {
          total: 102,
          userId: user2.id,
        },
        {
          total: 103,
          userId: user2.id,
        },
        {
          total: 104,
          userId: user2.id,
        },
        {
          total: 105,
          userId: user2.id,
        },
        {
          total: 105,
          userId: user2.id,
        },
      ],
    });

    const ordersS = await ordersService.find({ page: 1, perPage: 2 });

    expect(ordersS).toHaveProperty('data');
    expect(ordersS).toHaveProperty('pageInfo');
    expect(ordersS.pageInfo.total).toBe(7);
  });
  it('should throw an error if an order is not of a user', async () => {
    const user1 = await prismaService.user.create({
      data: { name: 'jon', email: 'jon@mail.co', password: '12345678' },
    });

    const myOrder = await prismaService.order.create({
      data: {
        total: 100,
        userId: user1.id,
      },
    });

    expect(async () => {
      await ordersService.findOrderByUserId('my.id', myOrder.id);
    }).rejects.toThrow();
  });

  it('should return an order of a user', async () => {
    const user1 = await prismaService.user.create({
      data: { name: 'jon', email: 'jon@mail.co', password: '12345678' },
    });

    const myOrder = await prismaService.order.create({
      data: {
        total: 100,
        userId: user1.id,
      },
    });

    const orderS = await ordersService.findOrderByUserId(user1.id, myOrder.id);

    expect(orderS).toHaveProperty('id');
  });

  it('should return all the orders of a user', async () => {
    const user1 = await prismaService.user.create({
      data: { name: 'jon', email: 'jon@mail.co', password: '12345678' },
    });
    const user2 = await prismaService.user.create({
      data: { name: 'jon', email: 'jo1n@mail.co', password: '12345678' },
    });

    const orders = await prismaService.order.createMany({
      data: [
        {
          total: 100,
          userId: user1.id,
        },
        {
          total: 101,
          userId: user2.id,
        },
        {
          total: 102,
          userId: user2.id,
        },
        {
          total: 103,
          userId: user2.id,
        },
        {
          total: 104,
          userId: user2.id,
        },
        {
          total: 105,
          userId: user1.id,
        },
        {
          total: 105,
          userId: user1.id,
        },
      ],
    });

    const ordersS = await ordersService.findByUserId(user1.id, {
      page: 1,
      perPage: 10,
    });
    expect(ordersS).toHaveProperty('data');
    expect(ordersS).toHaveProperty('pageInfo');
    expect(ordersS.pageInfo.total).toBe(3);
  });

  it('should create orders details', async () => {
    const product1 = await prismaService.product.create({
      data: {
        name: 'p1',
        price: 2,
        stock: 10,
      },
    });
    const product2 = await prismaService.product.create({
      data: {
        name: 'p1',
        price: 2,
        stock: 15,
      },
    });
    const product3 = await prismaService.product.create({
      data: {
        name: 'p1',
        price: 2,
        stock: 20,
      },
    });

    const user = await prismaService.user.create({
      data: {
        name: 'user',
        email: 'user@example.com',
        password: '123456',
        shopCart: {
          create: {},
        },
      },
      include: {
        shopCart: true,
      },
    });
  });
});
