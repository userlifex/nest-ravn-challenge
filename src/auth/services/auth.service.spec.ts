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

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: TokensService;
  let usersService: UsersService;
  let sendgridService: SendgridService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TokensModule,
        UsersModule,
        ConfigModule.forFeature(jwtConfigMock),
      ],
      providers: [
        AuthService,
        { provide: JwtService, useFactory: jwtMockService },
      ],
    }).compile();

    authService = module.get(AuthService);
    tokenService = module.get(TokensModule);
    usersService = module.get(UsersModule);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
