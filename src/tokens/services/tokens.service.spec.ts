import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { TokensService } from './tokens.service';
import { PrismaService } from '../../prisma/services/prisma.service';
import { JWTPayload } from 'src/auth/dto/response/jwt.payload.dto';

describe('TokensService', () => {
  let tokensService: TokensService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [TokensService],
    }).compile();

    tokensService = module.get<TokensService>(TokensService);
    prismaService = module.get<PrismaService>(PrismaService);

    prismaService.clearDatabase();
  });

  afterAll(async () => {
    prismaService.clearDatabase();
  });

  it('token service should be defined', () => {
    expect(tokensService).toBeDefined();
  });

  it('prisma sercice should be defined', () => {
    expect(tokensService).toBeDefined();
  });

  it('should create a token of a user', async () => {
    const user = await prismaService.user.create({
      data: { name: 'user', email: 'user@mail.co', password: '123456' },
    });

    const payload: JWTPayload = {
      sub: user.id,
      iat: new Date(),
      exp: new Date(),
    };

    const tokenStr = 'this.is.my.token';

    const token = await tokensService.create(tokenStr, payload);

    expect(token).toHaveProperty('id');
  });

  it('should return a userId with token', async () => {
    const user = await prismaService.user.create({
      data: { name: 'user', email: 'user@mail.co', password: '123456' },
    });

    const token = await prismaService.token.create({
      data: { token: 'my.token', userId: user.id, expirationDate: new Date() },
    });

    const userBearer = await tokensService.findUserId('my.token');

    expect(userBearer.userId).toBe(user.id);
  });
});
