import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ItemsOrderedService } from '../../items-ordered/services/items-ordered.service';
import { ApiLayer } from '../../utils';
import { CursorPagination } from '../../common/dtos/args/cursor-pagination.args';
import { OrderModel } from '../dtos/models/order.model';
import { OrdersService } from '../services/orders.service';

@Resolver()
export class OrderResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly itemsOrdered: ItemsOrderedService,
  ) {}
  @Query(() => OrderModel)
  async getAllOrders(pagination: CursorPagination) {
    return this.ordersService.find(pagination, ApiLayer.GQL);
  }

  @ResolveField()
  async getItemsOrder(@Parent() order: OrderModel) {
    const { id } = order;
    return this.itemsOrdered.findByOrderId(id);
  }
}
