import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { AuthModule } from '../../auth/auth.module';
import { AuthService } from '../../auth/services/auth.service';
import { jwtConfigMock, jwtMockService } from '../../common/mocks/default.mock';
import { SendgridModule } from '../../common/sendgrid/sendgrid.module';
import { SendgridService } from '../../common/sendgrid/services/sendgrid.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/services/prisma.service';
import { ProductsModule } from '../../products/products.module';
import { ProductsService } from '../../products/services/products.service';
import { ShopcartsService } from '../../shopcarts/services/shopcarts.service';
import { ShopcartsModule } from '../../shopcarts/shopcarts.module';
import { TokensModule } from '../../tokens/tokens.module';
import { UsersModule } from '../../users/users.module';
import * as utils from '../../utils';
import { ItemsInCartService } from './items-in-cart.service';

describe('ItemsInCartService', () => {
  let itemsInCartService: ItemsInCartService;
  let authService: AuthService;
  let prismaService: PrismaService;
  let shopCartService: ShopcartsService;
  let producstService: ProductsService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        PrismaModule,
        AuthModule,
        TokensModule,
        UsersModule,
        SendgridModule,
        ShopcartsModule,
        ProductsModule,
        ConfigModule.forFeature(jwtConfigMock),
      ],
      providers: [
        ItemsInCartService,
        { provide: JwtService, useFactory: jwtMockService },
      ],
    }).compile();

    itemsInCartService = module.get<ItemsInCartService>(ItemsInCartService);
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    shopCartService = module.get<ShopcartsService>(ShopcartsService);
    producstService = module.get<ProductsService>(ProductsService);

    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should items-in-cart be defined', () => {
    expect(itemsInCartService).toBeDefined();
  });

  it('should return all items-in-cart', async () => {
    const user = {
      name: 'amadeo',
      email: 'amadeo@gmail.com',
      password: '123456',
    };
    const userRegistered = await authService.signup(user);
    const cartItems = await itemsInCartService.find(userRegistered.id, {
      page: 1,
      perPage: 10,
    });
    const spy = jest.spyOn(utils, 'paginateParams');

    const paginate = utils.paginateParams({ page: 1, perPage: 10 });

    expect(spy).toHaveBeenCalled();
    expect(paginate).toEqual({ take: 10, skip: 0 });
    expect(cartItems).toHaveProperty('pageInfo');
    expect(cartItems).toHaveProperty('data');
    spy.mockRestore();
  });

  it('should return an item-in-cart by their ID', async () => {
    const user = {
      name: 'sebs',
      email: 'sebs@gmail.com',
      password: '123456',
    };

    const product = {
      name: 'chocolate',
      price: 1,
      stock: 10,
      description: 'chocolate con trozos de maní',
    };
    const userRegistered = await authService.signup(user);
    const productRegistered = await producstService.create(
      product as CreateProductDto,
    );
    const expected = await itemsInCartService.create({
      userId: userRegistered.id,
      productId: productRegistered.id,
      quantity: 2,
    });

    const result = await itemsInCartService.findOneById(expected.id);

    expect(result.id).toBe(expected.id);
  });

  it('should return an item-in-cart created', async () => {
    const user = {
      name: 'thiago',
      email: 'thiago@gmail.com',
      password: '123456',
    };

    const product = {
      name: 'galleta',
      price: 1,
      stock: 10,
      description: 'galletas bañadas en chocolate',
    };
    const userRegistered = await authService.signup(user);
    const productRegistered = await producstService.create(
      product as CreateProductDto,
    );
    await itemsInCartService.create({
      userId: userRegistered.id,
      productId: productRegistered.id,
      quantity: 2,
    });

    const secondAdd = await itemsInCartService.create({
      userId: userRegistered.id,
      productId: productRegistered.id,
      quantity: 2,
    });

    const result = await itemsInCartService.findOneById(secondAdd.id);

    expect(result.id).toBe(secondAdd.id);
    expect(result.quantity).toBe(secondAdd.quantity);
  });

  it('should return an item-in-cart updated', async () => {
    const user = {
      name: 'amds',
      email: 'amds@gmail.com',
      password: '123456',
    };

    const product = {
      name: 'galleta',
      price: 1,
      stock: 10,
      description: 'galletas bañadas en chocolate',
    };
    const userRegistered = await authService.signup(user);
    const productRegistered = await producstService.create(
      product as CreateProductDto,
    );
    const expected = await itemsInCartService.create({
      userId: userRegistered.id,
      productId: productRegistered.id,
      quantity: 4,
    });

    const result = await itemsInCartService.update(expected.id, 2);

    expect(result.quantity).not.toBe(expected.quantity);
    expect(result.id).toBe(expected.id);
  });

  it('should thrown an bad request about quantity exceeded', async () => {
    const user = {
      name: 'standford',
      email: 'standford@gmail.com',
      password: '123456',
    };

    const product = {
      name: 'galleta',
      price: 1,
      stock: 10,
      description: 'galletas bañadas en chocolate',
    };
    const userRegistered = await authService.signup(user);
    const productRegistered = await producstService.create(
      product as CreateProductDto,
    );
    const expected = await itemsInCartService.create({
      userId: userRegistered.id,
      productId: productRegistered.id,
      quantity: 4,
    });

    expect(async () => {
      await itemsInCartService.update(expected.id, 20);
    }).rejects.toThrow();
  });

  it('should return an item-in-cart deleted', async () => {
    const user = {
      name: 'logger',
      email: 'logger@gmail.com',
      password: '123456',
    };

    const product = {
      name: 'galleta',
      price: 1,
      stock: 10,
      description: 'galletas bañadas en chocolate',
    };
    const userRegistered = await authService.signup(user);
    const productRegistered = await producstService.create(
      product as CreateProductDto,
    );
    const expected = await itemsInCartService.create({
      userId: userRegistered.id,
      productId: productRegistered.id,
      quantity: 4,
    });

    const result = await itemsInCartService.delete(expected.id);

    expect(result.id).toBe(expected.id);
  });

  it('should return all items-in-cart deleted by shopCartId', async () => {
    const user = {
      name: 'rayban',
      email: 'rayban@gmail.com',
      password: '123456',
    };

    const product = {
      name: 'galleta',
      price: 1,
      stock: 10,
      description: 'galletas bañadas en chocolate',
    };
    const userRegistered = await authService.signup(user);
    const productRegistered = await producstService.create(
      product as CreateProductDto,
    );
    await itemsInCartService.create({
      userId: userRegistered.id,
      productId: productRegistered.id,
      quantity: 4,
    });

    const shopCart = await shopCartService.findOneByUserId(userRegistered.id);
    const result = await itemsInCartService.deleteItemsByCartId(shopCart.id);

    expect(result.count).toBe(1);
  });

  it('should return all items-in-cart of a shopCartId', async () => {
    const user = {
      name: 'aenima',
      email: 'aenima@gmail.com',
      password: '123456',
    };

    const product = {
      name: 'galleta',
      price: 1,
      stock: 10,
      description: 'galletas bañadas en chocolate',
    };
    const userRegistered = await authService.signup(user);
    const productRegistered = await producstService.create(
      product as CreateProductDto,
    );
    await itemsInCartService.create({
      userId: userRegistered.id,
      productId: productRegistered.id,
      quantity: 4,
    });

    const shopCart = await shopCartService.findOneByUserId(userRegistered.id);
    const result = await itemsInCartService.findManyToMakeOrder(shopCart.id);

    expect(result.length).toBe(1);
  });

  it('should throw a bad request about there is not items on their shopcart', async () => {
    const user = {
      name: 'heisenberg',
      email: 'heisenberg@gmail.com',
      password: '123456',
    };

    const userRegistered = await authService.signup(user);

    const shopCart = await shopCartService.findOneByUserId(userRegistered.id);

    expect(async () => {
      await itemsInCartService.findManyToMakeOrder(shopCart.id);
    }).rejects.toThrow();
  });
});
