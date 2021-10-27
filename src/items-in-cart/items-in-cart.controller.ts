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
import { ItemsInCartService } from './items-in-cart.service';

@Controller('users/me/shopcart/items-in-cart')
export class ItemsInCartController {
  constructor(private readonly itemsInCartService: ItemsInCartService) {}

  @Post()
  async create(
    @Request() req,
    @Body('quantity') quantity: number,
    @Param('productId') productId: string,
  ) {
    return this.itemsInCartService.create({
      userId: req.user.sub,
      quantity: quantity,
      productId: productId,
    });
  }

  @Get()
  async getAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    const userId = req.user.sub;
    return this.itemsInCartService.find({ userId, page, perPage });
  }

  @Get(':id')
  async getOneById(@Param('id') cartItemId: string) {
    return this.itemsInCartService.findOneById(cartItemId);
  }

  @Patch('id')
  async update(
    @Param('id') cartItemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.itemsInCartService.update(cartItemId, quantity);
  }

  @Delete('id')
  async delete(@Param('id') cartItemId: string) {
    return this.itemsInCartService.delete(cartItemId);
  }
}
