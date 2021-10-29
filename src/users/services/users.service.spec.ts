import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { CategoriesModule } from '../../categories/categories.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, CategoriesModule],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });
});
