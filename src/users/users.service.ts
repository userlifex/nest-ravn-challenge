import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneByEmail(email: string) {
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

  async create(user: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        ...user,
      },
    });
  }
}
