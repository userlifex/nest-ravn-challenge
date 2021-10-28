import { Roles } from '.prisma/client';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { UserEntity } from 'src/common/types';
import { ItemsInCartService } from './items-in-cart.service';

@Controller()
export class ItemsInCartController {
  constructor(private readonly itemsInCartService: ItemsInCartService) {}

  @Role(Roles.customer)
  @Post('products/:productId/items-in-cart')
  async create(
    @CurrentUser() user: UserEntity,
    @Body('quantity') quantity: number,
    @Param('productId') productId: string,
  ) {
    return this.itemsInCartService.create({
      userId: user.id,
      quantity: quantity,
      productId: productId,
    });
  }

  @Role(Roles.customer)
  @Get('products/:productId/items-in-cart')
  async getAll(
    @CurrentUser() user: UserEntity,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return this.itemsInCartService.find(user.id, { page, perPage });
  }

  @Role(Roles.customer)
  @Get('products/:productId/items-in-cart/:id')
  async getOneById(@Param('id') cartItemId: string) {
    return this.itemsInCartService.findOneById(cartItemId);
  }

  @Role(Roles.customer)
  @Patch('products/:productId/items-in-cart/:id')
  async update(
    @Param('id') cartItemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.itemsInCartService.update(cartItemId, quantity);
  }

  @Role(Roles.customer)
  @Delete('products/:productId/items-in-cart/:id')
  async delete(@Param('id') cartItemId: string) {
    return this.itemsInCartService.delete(cartItemId);
  }
}
