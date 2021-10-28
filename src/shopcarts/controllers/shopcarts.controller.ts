import { Controller, Get, Request } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserEntity } from 'src/common/types';
import { ShopcartsService } from '../services/shopcarts.service';

@Controller('users/me/shopcart')
export class ShopcartsController {
  constructor(private readonly shopCartsService: ShopcartsService) {}
  @Get()
  async findOneByUserId(@CurrentUser() user: UserEntity) {
    return this.shopCartsService.findOneByUserId(user.id);
  }
}
