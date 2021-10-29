import { Controller, Get, Request } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserEntity } from 'src/common/types';
import { ShopCartDto } from '../dto/response/shopcart.dto';
import { ShopcartsService } from '../services/shopcarts.service';

@Controller('users/me/shopcart')
export class ShopcartsController {
  constructor(private readonly shopCartsService: ShopcartsService) {}
  @Get()
  async findOneByUserId(@CurrentUser() user: UserEntity): Promise<ShopCartDto> {
    return this.shopCartsService.findOneByUserId(user.id);
  }
}
