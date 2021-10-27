import { Controller, Get, Request } from '@nestjs/common';
import { ShopcartsService } from './shopcarts.service';

@Controller('users/me/shopcart')
export class ShopcartsController {
  constructor(private readonly shopCartsService: ShopcartsService) {}
  @Get()
  async findOneByUserId(@Request() req) {
    return this.shopCartsService.findOneByUserId(req.user.sub);
  }
}
