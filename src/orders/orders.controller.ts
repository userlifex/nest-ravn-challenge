import {
  ParseIntPipe,
  Controller,
  DefaultValuePipe,
  Get,
  Query,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { OrdersService } from './orders.service';

@Controller('')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Get()
  //@Role(Roles.moderator)
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return this.ordersService.find({ page, perPage });
  }
}
