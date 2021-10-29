import { ShopCart } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShopCartDto } from '../dto/response/shopcart.dto';

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
    });

    return plainToClass(ShopCartDto, shopcart);
  }
}
