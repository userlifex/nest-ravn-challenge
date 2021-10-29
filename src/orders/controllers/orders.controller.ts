import {
  ParseIntPipe,
  Controller,
  DefaultValuePipe,
  Get,
  Query,
  Post,
  Param,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { UserEntity } from 'src/common/types';
import { OrdersService } from '../services/orders.service';

@Controller('')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('orders')
  @Role(Roles.moderator)
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return this.ordersService.find({ page, perPage });
  }

  @Get('users/me/orders')
  @Role(Roles.customer)
  async getMyOrders(
    @CurrentUser() user: UserEntity,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return this.ordersService.findByUserId(user.id, { page, perPage });
  }

  @Get('users/me/orders/:id')
  @Role(Roles.customer)
  async getMyOrder(
    @CurrentUser() user: UserEntity,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
    @Param('id') orderId: string,
  ) {
    return this.ordersService.findOrderByUserId(user.id, orderId);
  }

  @Post('users/me/shopcarts/orders')
  @Role(Roles.customer)
  async createOrder(@CurrentUser() user: UserEntity) {
    return this.ordersService.createOrder(user.id);
  }
}
