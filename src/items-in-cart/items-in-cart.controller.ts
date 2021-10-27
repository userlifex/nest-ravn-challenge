import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { userInfo } from 'os';
import { Public } from 'src/common/decorators/public.decorator';
import { ItemsInCartModule } from './items-in-cart.module';
import { ItemsInCartService } from './items-in-cart.service';

@Controller('')
export class ItemsInCartController {
  constructor(private readonly itemsInCartService: ItemsInCartService) {}

  @Get('')
  async getAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    const userId = req.user.sub;
    return this.itemsInCartService.find({ userId, page, perPage });
  }

  @Post('')
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
}
