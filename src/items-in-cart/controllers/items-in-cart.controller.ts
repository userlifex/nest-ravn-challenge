import { ItemsInCart, Roles } from '.prisma/client';
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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiLayer } from 'src/utils';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Role } from '../../common/decorators/role.decorator';
import { UserEntity } from '../../common/types';
import { UpdateItemInCartDto } from '../dto/request/update.item.in.cart.dto';
import { ItemInCartDto } from '../dto/response/item.in.cart.dto';
import { ItemsInCartService } from '../services/items-in-cart.service';

@ApiTags('items-in-cart')
@Controller()
export class ItemsInCartController {
  constructor(private readonly itemsInCartService: ItemsInCartService) {}

  @UseGuards(JwtAuthGuard)
  @Role(Roles.customer)
  @Post('products/:productId/items-in-cart')
  async create(
    @CurrentUser() user: UserEntity,
    @Body('quantity') quantity: number,
    @Param('productId') productId: string,
  ): Promise<ItemInCartDto> {
    return this.itemsInCartService.create({
      userId: user.id,
      quantity: quantity,
      productId: productId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/me/shopcart/items-in-cart')
  async getAll(
    @CurrentUser() user: UserEntity,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    return this.itemsInCartService.find(
      user.id,
      { page, perPage },
      ApiLayer.REST,
    );
  }

  @Get('users/me/shopcart/items-in-cart/:id')
  async getOneById(@Param('id') cartItemId: string): Promise<ItemInCartDto> {
    return this.itemsInCartService.findOneById(cartItemId);
  }

  @Patch('users/me/shopcart/items-in-cart/:id')
  async update(
    @Param('id') cartItemId: string,
    @Body('quantity') quantity: number,
  ): Promise<UpdateItemInCartDto> {
    return this.itemsInCartService.update(cartItemId, quantity);
  }

  @Delete('users/me/shopcart/items-in-cart/:id')
  async delete(@Param('id') cartItemId: string): Promise<ItemInCartDto> {
    return this.itemsInCartService.delete(cartItemId);
  }
}
