import { ShopCart } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShopcartsService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
