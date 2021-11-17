import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InputPaginationDto } from '../../common/dtos/input-pagination.dto';
import { PrismaService } from '../../prisma/services/prisma.service';
import {
  ApiLayer,
  GQLPageSerializer,
  GQLpaginateParams,
  RESTpaginateParams,
  RESTpaginationSerializer,
} from '../../utils';
import { UsersService } from '../../users/services/users.service';
import { ProductsService } from '../../products/services/products.service';
import { ItemsInCartService } from '../../items-in-cart/services/items-in-cart.service';
import { ShopcartsService } from '../../shopcarts/services/shopcarts.service';
import { getEdges } from '../../common/dtos/args/cursor-pagination.args';
import { plainToClass } from 'class-transformer';
import { OrderModel } from '../dtos/models/order.model';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly itemsInCartService: ItemsInCartService,
    private readonly shopcartsService: ShopcartsService,
  ) {}

  async findRest({ page, perPage }: InputPaginationDto) {
    const prismaPagination = RESTpaginateParams({ page, perPage });

    const total = await this.prismaService.order.count({});

    const pageInfo = RESTpaginationSerializer(total, { page, perPage });

    const data = await this.prismaService.order.findMany({
      ...prismaPagination,
      include: {
        user: true,
      },
    });

    return {
      pageInfo,
      data,
    };
  }

  async findGql({ first, after }: InputPaginationDto) {
    const prismaPagination = GQLpaginateParams({ first, after });

    const { firstCursor, lastCursor } = await this.prismaService.getBounds(
      'order',
    );

    const data = await this.prismaService.order.findMany({
      ...prismaPagination,
    });

    const edges = getEdges(plainToClass(OrderModel, data));
    const pageInfo = GQLPageSerializer<Order>(firstCursor, lastCursor, data);

    return {
      edges,
      pageInfo,
    };
  }

  async find(pagination: InputPaginationDto, layer = ApiLayer.REST) {
    if (layer === ApiLayer.GQL) {
      return await this.findGql(pagination);
    }

    return await this.findRest(pagination);
  }

  async findByUserIdGQL(userId: string, { first, after }: InputPaginationDto) {
    const prismaPagination = GQLpaginateParams({ first, after });

    const { firstCursor, lastCursor } = await this.prismaService.getBounds(
      'order',
    );

    const data = await this.prismaService.order.findMany({
      where: { userId },
      ...prismaPagination,
    });

    const edges = getEdges(plainToClass(OrderModel, data));
    const pageInfo = GQLPageSerializer<Order>(firstCursor, lastCursor, data);

    return {
      edges,
      pageInfo,
    };
  }

  async findByUserId(userId: string, { page, perPage }: InputPaginationDto) {
    const prismaPagination = RESTpaginateParams({ page, perPage });

    const total = await this.prismaService.order.count({ where: { userId } });

    const pageInfo = RESTpaginationSerializer(total, { page, perPage });

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

    if (order?.userId !== userId) {
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
