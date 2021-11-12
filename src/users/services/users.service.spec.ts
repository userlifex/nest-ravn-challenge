import { Test, TestingModule } from '@nestjs/testing';
import { SendgridModule } from '../../common/sendgrid/sendgrid.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/services/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule, SendgridModule],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should update a user', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'user',
        email: 'user@example.com',
        password: 'password',
      },
    });

    const updatedUser = await usersService.update(user.id, { name: 'name' });

    expect(updatedUser).toHaveProperty('id');
    expect(updatedUser.name).toBe('name');
    expect(updatedUser.email).toBe(user.email);
  });

  it('should create a user', async () => {
    const newUser = await usersService.create({
      name: 'user',
      email: 'user@example.com',
      password: 'password',
    });

    expect(newUser).toHaveProperty('id');
  });

  it('should get my profile ', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'user',
        email: 'user@example.com',
        password: 'password',
      },
    });

    const foundUser = await usersService.getMyProfile(user.id);

    expect(foundUser).toHaveProperty('id');
    expect(foundUser.id).toBe(user.id);
  });

  it('should find an user by id', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'user',
        email: 'user@example.com',
        password: 'password',
      },
    });

    const foundUser = await usersService.findOneById(user.id);

    expect(foundUser).toHaveProperty('id');
    expect(foundUser.id).toBe(user.id);
  });

  it('should throw error when not exists id', async () => {
    expect(async () => {
      await usersService.findOneById('mail');
    }).rejects.toThrow();
  });

  it('should find an user by email', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'user',
        email: 'user@example.com',
        password: 'password',
      },
    });

    const foundUser = await usersService.findOneByEmail(user.email);

    expect(foundUser).toHaveProperty('id');
  });

  it('should return null when not exists', async () => {
    const foundUser = await usersService.findOneByEmail('mail');

    expect(foundUser).toBeNull();
  });
});
