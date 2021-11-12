import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../../auth/auth.module';
import { AuthService } from '../../auth/services/auth.service';
import { UsersModule } from '../../users/users.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/services/prisma.service';
import { ShopcartsService } from './shopcarts.service';

describe('ShopcartsService', () => {
  let shopCartService: ShopcartsService;
  let prismaService: PrismaService;
  let authService: AuthService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule, UsersModule, AuthModule],
      providers: [ShopcartsService],
    }).compile();

    shopCartService = module.get<ShopcartsService>(ShopcartsService);
    prismaService = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);

    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should shopcart be defined', () => {
    expect(shopCartService).toBeDefined();
  });

  it('should return a shopcart when found an userId', async () => {
    const user = {
      name: 'sebast',
      email: 'sebast@gmail.com',
      password: '123456',
    };
    const expected = await authService.signup(user);

    const result = await shopCartService.findOneByUserId(expected.id);

    //expect(result.userId).toBe(expected.id);
  });

  it('should return a shopcart when found an userId', async () => {
    const user = {
      name: 'sebs',
      email: 'sebs@gmail.com',
      password: '123456',
    };
    const expected = await authService.signup(user);

    const result = await shopCartService.findOneByUserId(expected.id);

    //expect(result.userId).toBe(expected.id);
  });

  it('should return a shopcart', async () => {
    const user = {
      name: 'edison',
      email: 'edison@gmail.com',
      password: '123456',
    };

    const newUser = await authService.signup(user);
    const expected = await shopCartService.findOneByUserId(newUser.id);
    const result = await shopCartService.validateShopcartByUser(newUser.id);

    expect(result.id).toBe(expected.id);
  });
});
