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
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { UserEntity } from 'src/common/types';
import { CreateItemInCartDto } from '../dto/request/create.item.in.cart.dto';
import { UpdateItemInCartDto } from '../dto/request/update.item.in.cart.dto';
import { ItemInCartDto } from '../dto/response/item.in.cart.dto';
import { ItemInCartPaginationDto } from '../dto/response/item.in.cart.pagination.dto';
import { ItemsInCartService } from '../services/items-in-cart.service';

@Controller()
export class ItemsInCartController {
  constructor(private readonly itemsInCartService: ItemsInCartService) {}

  @Role(Roles.customer)
  @Post('products/:productId/items-in-cart')
  async create(
    @CurrentUser() user: UserEntity,
    @Body('quantity') quantity: number,
    @Param('productId') productId: string,
  ): Promise<CreateItemInCartDto> {
    return this.itemsInCartService.create({
      userId: user.id,
      quantity: quantity,
      productId: productId,
    });
  }

  @Role(Roles.customer)
  @Get('users/me/shopcart/items-in-cart')
  async getAll(
    @CurrentUser() user: UserEntity,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ): Promise<ItemInCartPaginationDto> {
    return this.itemsInCartService.find(user.id, { page, perPage });
  }

  @Role(Roles.customer)
  @Get('users/me/shopcart/items-in-cart/:id')
  async getOneById(@Param('id') cartItemId: string): Promise<ItemInCartDto> {
    return this.itemsInCartService.findOneById(cartItemId);
  }

  @Role(Roles.customer)
  @Patch('users/me/shopcart/items-in-cart/:id')
  async update(
    @Param('id') cartItemId: string,
    @Body('quantity') quantity: number,
  ): Promise<UpdateItemInCartDto> {
    return this.itemsInCartService.update(cartItemId, quantity);
  }

  @Role(Roles.customer)
  @Delete('users/me/shopcart/items-in-cart/:id')
  async delete(@Param('id') cartItemId: string): Promise<ItemInCartDto> {
    return this.itemsInCartService.delete(cartItemId);
  }
}
