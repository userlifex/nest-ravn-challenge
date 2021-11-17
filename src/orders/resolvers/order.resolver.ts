import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ItemsOrderedService } from '../../items-ordered/services/items-ordered.service';
import { ApiLayer } from '../../utils';
import { CursorPagination } from '../../common/dtos/args/cursor-pagination.args';
import { CursorPaginatedOrders, OrderModel } from '../dtos/models/order.model';
import { OrdersService } from '../services/orders.service';
import { Public } from '../../common/decorators/public.decorator';
import { ItemOrderedModel } from '../../items-ordered/dtos/models/item-ordered.model';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserEntity } from '../../common/types';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt.guard';
import { Role } from '../../common/decorators/role.decorator';
import { Roles } from '@prisma/client';
import { RolesGuard } from '../../common/guards/role.guard';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';

@Resolver(() => OrderModel)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly itemsOrderedService: ItemsOrderedService,
  ) {}

  @Public()
  @Query(() => CursorPaginatedOrders)
  async getAllOrders(@Args() pagination: CursorPagination) {
    const { first, after } = pagination;
    return this.ordersService.find({ first, after }, ApiLayer.GQL);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.customer)
  @Mutation(() => OrderModel)
  async makeOrder(@CurrentUser() user: UserEntity) {
    return this.ordersService.createOrder(user.id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.customer)
  @Query(() => CursorPaginatedOrders)
  async getMyOrders(
    @CurrentUser() user: UserEntity,
    @Args() pagination: CursorPagination,
  ) {
    const { first, after } = pagination;
    return this.ordersService.findByUserIdGQL(user.id, { first, after });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.customer)
  @Query(() => OrderModel)
  async getMyOrder(
    @CurrentUser() user: UserEntity,
    @Args('orderId') orderId: string,
  ) {
    return this.ordersService.findOrderByUserId(user.id, orderId);
  }

  @ResolveField(() => ItemOrderedModel)
  async itemsOrdered(@Parent() order: OrderModel) {
    const { id } = order;
    return this.itemsOrderedService.findByOrderId(id);
  }
}
