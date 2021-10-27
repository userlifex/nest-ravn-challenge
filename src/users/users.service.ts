import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { JWTPayload } from 'src/auth/dto/jwt.payload.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';

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

  async findOneById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getMyProfile(user: JWTPayload) {
    const { sub } = user;
    return await this.prismaService.user.findUnique({
      where: {
        id: sub,
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
