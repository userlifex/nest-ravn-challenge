import { ShopCart } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { IBaseDto } from 'src/interfaces/base-dto.interface';
import { ICrud } from 'src/interfaces/crud.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ShopcartsService implements ICrud<ShopCart> {
  constructor(private readonly prismaService: PrismaService) {}
  async find(pagination: InputPaginationDto) {
    throw new Error('Method not implemented.');
  }

  async findOneById(id: string): Promise<ShopCart> {
    return await this.prismaService.shopCart.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByUserId(userId: string): Promise<ShopCart> {
    return await this.prismaService.shopCart.findUnique({
      where: {
        userId,
      },
      include: {
        itemsInCart: {
          include: {
            product: true,
          },
        },
      },
    });
  }
  async create(input: IBaseDto): Promise<ShopCart> {
    throw new Error('Method not implemented.');
  }
  async update(id: string, input: IBaseDto): Promise<ShopCart> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<ShopCart> {
    throw new Error('Method not implemented.');
  }
}
