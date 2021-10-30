import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { jwtConfigMock, jwtMockService } from '../../common/mocks/default.mock';
import { SendgridService } from '../../common/sendgrid/services/sendgrid.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../..//prisma/services/prisma.service';
import { TokensService } from '../../tokens/services/tokens.service';
import { TokensModule } from '../../tokens/tokens.module';
import { UsersService } from '../../users/services/users.service';
import { UsersModule } from '../../users/users.module';
import { AuthService } from './auth.service';
import { SendgridModule } from '../../common/sendgrid/sendgrid.module';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let tokenService: TokensService;
  let usersService: UsersService;
  let sendgridService: SendgridService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        PrismaModule,
        TokensModule,
        UsersModule,
        SendgridModule,
        ConfigModule.forFeature(jwtConfigMock),
      ],
      providers: [
        AuthService,
        { provide: JwtService, useFactory: jwtMockService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    tokenService = module.get<TokensService>(TokensService);
    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    sendgridService = module.get<SendgridService>(SendgridService);

    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should auth be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should token be defined', () => {
    expect(tokenService).toBeDefined();
  });

  it('should users be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should validate credentials of user regristred', async () => {
    const newUser = {
      name: 'amadeo',
      email: 'amadeo@gmail.com',
      password: '123456',
    };
    const result = await authService.signup(newUser);
    const expected = await authService.validateUser(
      newUser.email,
      newUser.password,
    );

    expect(result.id).toBe(expected.id);
  });

  it('should signup a new user', async () => {
    const newUser = {
      name: 'sebs',
      email: 'sebs@gmail.com',
      password: '123456',
    };
    const result = await authService.signup(newUser);

    expect(result).toHaveProperty('id');
  });

  it('should login an user and generate a token', async () => {
    const user = {
      name: 'alvaro',
      email: 'alvaro@gmail.com',
      password: '123456',
    };
    const userRegistered = await authService.signup(user);
    const result = await authService.login(userRegistered);

    expect(result).toHaveProperty('access_token');
  });

  it('should change an password', async () => {
    const myToken = 'my.jwt.token';
    const user = {
      name: 'frank',
      email: 'frank@gmail.com',
      password: '123456',
    };

    await authService.signup(user);
    const userFound = await usersService.findOneByEmail('frank@gmail.com');
    const token = await tokenService.create(myToken, {
      sub: userFound.id,
      iat: new Date(),
      exp: new Date(),
    });
    const result = await authService.changePassword(myToken, user.email);

    expect(result).toHaveProperty('message');
  });
});
