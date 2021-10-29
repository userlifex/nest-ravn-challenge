import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/auth/dto/response/user.dto';
import { SengridService } from 'src/common/sengrid/sengrid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create.user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sendgridService: SengridService,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findFirst({
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

  async update(id: string, input) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });
  }

  async sendEmailToUser(email, options) {
    await this.sendgridService.createEmail({ to: email, ...options });
  }
}
