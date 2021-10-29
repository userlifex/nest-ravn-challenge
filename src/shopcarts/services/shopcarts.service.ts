import { ShopCart } from '.prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShopcartsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneById(id: string) {
    const shopcart = await this.prismaService.shopCart.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: false,
    });

    if (!shopcart) {
      throw new NotFoundException('shopcart not found');
    }

    return shopcart;
  }

  async findOneByUserId(userId: string): Promise<ShopCart> {
    const shopcart = await this.prismaService.shopCart.findUnique({
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
      rejectOnNotFound: false,
    });

    if (!shopcart) {
      throw new NotFoundException('shopcart not found');
    }

    return shopcart;
  }

  async validateShopcartByUser(userId: string) {
    const shopcart = await this.prismaService.shopCart.findUnique({
      where: { userId },
      select: {
        id: true,
      },
      rejectOnNotFound: false,
    });

    if (!shopcart) {
      throw new NotFoundException('shopcart not found');
    }

    return shopcart;
  }
}
