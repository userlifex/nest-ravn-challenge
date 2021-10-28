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
