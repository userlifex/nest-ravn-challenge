import { BadRequestException, Injectable } from '@nestjs/common';
import { InputPaginationDto } from 'src/common/dtos/input-pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginateParams, paginationSerializer } from 'src/utils';
import { UsersService } from 'src/users/services/users.service';
import { ProductsService } from 'src/products/services/products.service';
import { ItemsInCartService } from 'src/items-in-cart/services/items-in-cart.service';
import { ShopcartsService } from 'src/shopcarts/services/shopcarts.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly itemsInCartService: ItemsInCartService,
    private readonly shopcartsService: ShopcartsService,
  ) {}

  async find({ page, perPage }: InputPaginationDto) {
    const prismaPagination = paginateParams({ page, perPage });

    const total = await this.prismaService.order.count({});

    const pageInfo = paginationSerializer(total, { page, perPage });

    const data = await this.prismaService.order.findMany({
      include: {
        user: true,
      },
      ...prismaPagination,
    });

    return {
      pageInfo,
      data,
    };
  }

  async findByUserId(userId: string, { page, perPage }: InputPaginationDto) {
    const prismaPagination = paginateParams({ page, perPage });

    const total = await this.prismaService.order.count({});

    const pageInfo = paginationSerializer(total, { page, perPage });

    const data = await this.prismaService.order.findMany({
      where: { userId },
      include: {
        itemsOrdered: true,
      },
      ...prismaPagination,
    });

    return {
      pageInfo,
      data,
    };
  }

  async createOrder(userId: string) {
    const shopCart = await this.prismaService.shopCart.findUnique({
      where: { userId },
      rejectOnNotFound: false,
    });

    const shopCartItems = await this.prismaService.itemsInCart.findMany({
      where: {
        shopCartId: shopCart.id,
      },
      select: {
        quantity: true,
        product: {
          select: {
            id: true,
            price: true,
            stock: true,
          },
        },
      },
    });

    if (shopCartItems.length === 0) {
      throw new BadRequestException('there are 0 items in cart');
    }

    let total = 0;
    const itemsOrder = [];
    for (const item of shopCartItems) {
      const { price, stock } = item.product;
      const { quantity } = item;
      let subTotal = 0;

      if (quantity > stock) {
        throw new BadRequestException('out of stock');
      }

      const newStock = stock - quantity;

      if (newStock < 3) {
        console.log('send email');
      }

      await this.productsService.update(item.product.id, { stock: newStock });

      subTotal = +price * quantity;

      itemsOrder.push({
        subTotal,
        quantity,
        sellPrice: price,
        productId: item.product.id,
      });

      total += subTotal;
    }

    const order = await this.prismaService.order.create({
      data: {
        total,
        userId,
        itemsOrdered: { createMany: { data: itemsOrder } },
      },
    });

    await this.itemsInCartService.deleteItemsByCartId(shopCart.id);

    return order;
  }
}
