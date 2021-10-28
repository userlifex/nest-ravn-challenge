import { ItemsInCart } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { IBaseDto } from 'src/interfaces/base-dto.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShopcartsService } from 'src/shopcarts/services/shopcarts.service';
import { paginateParams, paginationSerializer } from 'src/utils';

@Injectable()
export class ItemsInCartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shopCartService: ShopcartsService,
  ) {}

  async find({ userId, page, perPage }: InputPaginationDto) {
    console.log(page, perPage);

    const prismaPagination = paginateParams({ page, perPage });

    const shopCart = await this.shopCartService.findOneByUserId(userId);

    const total = await this.prismaService.itemsInCart.count({
      where: {
        shopCartId: shopCart.id,
      },
    });

    const pageInfo = paginationSerializer(total, { page, perPage });

    // if (!pageInfo.prevPage && !pageInfo.nextPage) {
    //   throw new BadRequestException();
    // }

    const data = await this.prismaService.itemsInCart.findMany({
      ...prismaPagination,
      where: {
        shopCartId: shopCart.id,
      },
    });

    return {
      pageInfo,
      data,
    };
  }

  async findOneById(id: string): Promise<ItemsInCart> {
    return await this.prismaService.itemsInCart.findUnique({
      where: {
        id,
      },
    });
  }

  async create(input): Promise<ItemsInCart> {
    const shopCart = await this.shopCartService.findOneByUserId(input.userId);

    const updateStock = await this.prismaService.product.update({
      where: {
        id: input.productId,
      },
      data: {
        stock: {
          decrement: input.quantity,
        },
      },
    });

    const cartItem = await this.prismaService.itemsInCart.upsert({
      where: {
        shopcart_product_item: {
          shopCartId: shopCart.id,
          productId: input.productId,
        },
      },
      create: {
        shopCart: {
          connect: {
            id: shopCart.id,
          },
        },
        product: {
          connect: {
            id: input.productId,
          },
        },
        quantity: input.quantity,
      },
      update: {
        quantity: {
          increment: input.quantity,
        },
      },
      include: {
        product: true,
      },
    });

    Promise.all([cartItem, updateStock]);

    return cartItem;
  }

  async update(id: string, input: IBaseDto): Promise<ItemsInCart> {
    return await this.prismaService.itemsInCart.update({
      where: {
        id,
      },
      data: {
        quantity: input,
      },
    });
  }

  async delete(id: string): Promise<ItemsInCart> {
    return await this.prismaService.itemsInCart.delete({
      where: {
        id,
      },
    });
  }

  async deleteItemsByCartId(shopCartId: string) {
    return await this.prismaService.itemsInCart.deleteMany({
      where: {
        shopCartId,
      },
    });
  }
}
