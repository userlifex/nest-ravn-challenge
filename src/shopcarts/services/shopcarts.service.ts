import { ItemsInCart, ShopCart } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../../prisma/services/prisma.service';
import { ShopCartDto } from '../dto/response/shopcart.dto';

@Injectable()
export class ShopcartsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneByUserId(userId: string): Promise<ShopCartDto> {
    const shopcart = await this.prismaService.shopCart.findUnique({
      where: {
        userId,
      },
      include: {
        itemsInCart: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
              },
            },
          },
        },
      },
      rejectOnNotFound: true,
    });

    return plainToClass(ShopCartDto, shopcart);
  }

  async validateShopcartByUser(userId: string) {
    const shopcart = await this.prismaService.shopCart.findUnique({
      where: { userId },
      select: {
        id: true,
      },
      rejectOnNotFound: true,
    });

    return plainToClass(ShopCartDto, shopcart);
  }
}
