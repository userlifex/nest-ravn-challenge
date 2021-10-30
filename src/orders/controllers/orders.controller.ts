import {
  ParseIntPipe,
  Controller,
  DefaultValuePipe,
  Get,
  Query,
  Post,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/decorators/role.decorator';
import { UserEntity } from '../../common/types';
import { OrdersService } from '../services/orders.service';

@ApiTags('orders')
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
