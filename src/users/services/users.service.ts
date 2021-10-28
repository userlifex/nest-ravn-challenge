import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/auth/dto/response/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create.user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findOneById(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return plainToClass(UserDto, user);
  }

  async getMyProfile(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        shopCart: true,
        orders: true,
      },
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        ...user,
        shopCart: {
          create: {},
        },
      },
      include: {
        shopCart: true,
      },
    });
  }
}