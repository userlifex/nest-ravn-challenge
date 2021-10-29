import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SendgridService } from 'src/common/sendgrid/sendgrid.service';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { CreateUserDto } from '../dto/request/create.user.dto';
import { UpdateUserDto } from '../dto/request/update.user.dto';
import { UserProfileDto } from '../dto/response/user.profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sendgridService: SendgridService,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
      rejectOnNotFound: false,
    });
  }

  async findOneById(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getMyProfile(id: string): Promise<UserProfileDto> {
    const me = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        shopCart: {
          select: {
            id: true,
          },
        },
        orders: true,
      },
    });

    return plainToClass(UserProfileDto, me);
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

  async update(id: string, input: UpdateUserDto): Promise<UpdateUserDto> {
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
