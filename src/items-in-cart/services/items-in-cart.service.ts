import { ItemsInCart } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/services/products.service';
import { ShopcartsService } from 'src/shopcarts/services/shopcarts.service';
import { paginateParams, paginationSerializer } from 'src/utils';
import { CreateItemInCartDto } from '../dto/request/create.item.in.cart.dto';
import { UpdateItemInCartDto } from '../dto/request/update.item.in.cart.dto';
import { ItemInCartDto } from '../dto/response/item.in.cart.dto';
import { ItemInCartPaginationDto } from '../dto/response/item.in.cart.pagination.dto';

@Injectable()
export class ItemsInCartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shopCartService: ShopcartsService,
    private readonly productService: ProductsService,
  ) {}

  async find(
    userId: string,
    { page, perPage }: InputPaginationDto,
  ): Promise<ItemInCartPaginationDto> {
    const prismaPagination = paginateParams({ page, perPage });

    const shopCart = await this.shopCartService.findOneByUserId(userId);

    const total = await this.prismaService.itemsInCart.count({
      where: {
        shopCartId: shopCart.id,
      },
    });

    const pageInfo = paginationSerializer(total, { page, perPage });

    const items = await this.prismaService.itemsInCart.findMany({
      ...prismaPagination,
      where: {
        shopCartId: shopCart.id,
      },
      select: {
        id: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
      },
    });

    const data = plainToClass(ItemInCartDto, items);

    return {
      pageInfo,
      data,
    };
  }

  async findOneById(id: string): Promise<ItemInCartDto> {
    const item = await this.prismaService.itemsInCart.findUnique({
      where: {
        id,
      },
    });

    return plainToClass(ItemInCartDto, item);
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

  async create(input: CreateItemInCartDto): Promise<CreateItemInCartDto> {
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
        select: {
          id: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
            },
          },
        },
      });
      return plainToClass(CreateItemInCartDto, newItem);
    } else {
      const itemUpdated = await this.update(carItem.id, input.quantity, true);
      return plainToClass(CreateItemInCartDto, itemUpdated);
    }
  }

  async update(
    id: string,
    quantity: number,
    fromCreate = false,
  ): Promise<UpdateItemInCartDto> {
    const cartItem = await this.findOneById(id);

    if (fromCreate) {
      quantity += cartItem.quantity;
    }

    const input = {
      productId: cartItem.product.id,
      quantity,
    };

    console.log(cartItem.quantity);

    const isStockAvailable = await this.verifyQuantity(id, input);
    console.log(isStockAvailable);

    if (!isStockAvailable) {
      throw new BadRequestException('Stock is not available');
    }

    const itemUpdated = await this.prismaService.itemsInCart.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
      select: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
      },
    });
    return plainToClass(UpdateItemInCartDto, itemUpdated);
  }

  async delete(id: string): Promise<ItemInCartDto> {
    const item = await this.prismaService.itemsInCart.delete({
      where: {
        id,
      },
    });

    return plainToClass(ItemInCartDto, item);
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
}
