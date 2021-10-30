import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InputPaginationDto } from '../../common/dtos/input-pagination.dto';
import { PrismaService } from '../../prisma/services/prisma.service';
import { paginateParams, paginationSerializer } from '../../utils';
import { UsersService } from '../../users/services/users.service';
import { ProductsService } from '../../products/services/products.service';
import { ItemsInCartService } from '../../items-in-cart/services/items-in-cart.service';
import { ShopcartsService } from '../../shopcarts/services/shopcarts.service';

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

    const total = await this.prismaService.order.count({ where: { userId } });

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

  async findOrderByUserId(userId: string, orderId: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      rejectOnNotFound: false,
    });

    if (order.userId !== userId) {
      throw new NotFoundException();
    }

    return order;
  }

  async createOrderDetails(shopcartItems) {
    let total = 0;
    const itemsOrder = [];
    for (const item of shopcartItems) {
      const { price, stock } = item.product;
      const { quantity } = item;
      let subTotal = 0;

      if (quantity > stock) {
        throw new BadRequestException('out of stock');
      }

      const newStock = stock - quantity;

      if (newStock <= 3) {
        console.log('this is a stock');
        await this.productsService.sendEmailToLastUserLikes(item.product);
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

    return { total, itemsOrder };
  }

  async createOrder(userId: string) {
    const shopcart = await this.shopcartsService.validateShopcartByUser(userId);
    const shopcartItems = await this.itemsInCartService.findManyToMakeOrder(
      shopcart.id,
    );

    const { itemsOrder, total } = await this.createOrderDetails(shopcartItems);

    const order = await this.prismaService.order.create({
      data: {
        total,
        userId,
        itemsOrdered: { createMany: { data: itemsOrder } },
      },
    });

    await this.itemsInCartService.deleteItemsByCartId(shopcart.id);

    return order;
  }
}
