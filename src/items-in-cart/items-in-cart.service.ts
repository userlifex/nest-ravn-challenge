import { ItemsInCart } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import e from 'express';
import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/services/products.service';
import { ShopcartsService } from 'src/shopcarts/services/shopcarts.service';
import { paginateParams, paginationSerializer } from 'src/utils';
import { CreateItemInCartDto } from './dto/create.item.in.cart.dto';

@Injectable()
export class ItemsInCartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shopCartService: ShopcartsService,
    private readonly productService: ProductsService,
  ) {}

  async find(userId: string, { page, perPage }: InputPaginationDto) {
    console.log(page, perPage);

    const prismaPagination = paginateParams({ page, perPage });

    const shopCart = await this.shopCartService.findOneByUserId(userId);

    const total = await this.prismaService.itemsInCart.count({
      where: {
        shopCartId: shopCart.id,
      },
    });

    const pageInfo = paginationSerializer(total, { page, perPage });

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

  private async findOneByUniqueCompound(shopCartId: string, productId: string) {
    return await this.prismaService.itemsInCart.findUnique({
      where: {
        shopcart_product_item: {
          shopCartId,
          productId,
        },
      },
      rejectOnNotFound: false,
    });
  }

  async findManyToMakeOrder(shopcartId: string) {
    const shopCartItems = await this.prismaService.itemsInCart.findMany({
      where: {
        shopCartId: shopcartId,
      },
      select: {
        quantity: true,
        product: {
          select: {
            id: true,
            price: true,
            stock: true,
            lastLikeUserId: true,
          },
        },
      },
    });

    if (shopCartItems.length === 0) {
      throw new BadRequestException('there are 0 items in cart');
    }

    return shopCartItems;
  }

  async create(input: CreateItemInCartDto): Promise<ItemsInCart> {
    const shopCart = await this.shopCartService.findOneByUserId(input.userId);
    const carItem = await this.findOneByUniqueCompound(
      shopCart.id,
      input.productId,
    );

    if (!carItem) {
      const newItem = await this.prismaService.itemsInCart.create({
        data: {
          productId: input.productId,
          shopCartId: shopCart.id,
        },
      });
      return newItem;
    } else {
      const itemUpdated = await this.update(carItem.id, input.quantity, true);
      return itemUpdated;
    }
  }

  async update(
    id: string,
    quantity: number,
    fromCreate = false,
  ): Promise<ItemsInCart> {
    const cartItem = await this.findOneById(id);

    if (fromCreate) {
      quantity += cartItem.quantity;
    }

    const input = {
      productId: cartItem.productId,
      quantity,
    };

    console.log(cartItem.quantity);

    const isStockAvailable = await this.verifyQuantity(id, input);
    console.log(isStockAvailable);

    if (isStockAvailable) {
      const itemUpdated = await this.prismaService.itemsInCart.update({
        where: {
          id,
        },
        data: {
          quantity,
        },
      });
      return itemUpdated;
    }

    console.log('cantidad excede del stock');
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

  private async verifyQuantity(cartItemId: string, input): Promise<boolean> {
    const cartItem = await this.findOneById(cartItemId);

    const isStockAvailable = this.productService.validateStock(
      input.productId,
      input.quantity,
    );

    return isStockAvailable;
  }
}
