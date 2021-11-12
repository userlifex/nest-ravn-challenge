import { ShopCart } from '.prisma/client';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserEntity } from '../../common/types';
import { ShopCartDto } from '../dto/response/shopcart.dto';
import { ShopcartsService } from '../services/shopcarts.service';

@ApiTags('shopcarts')
@Controller('users/me/shopcart')
export class ShopcartsController {
  constructor(private readonly shopCartsService: ShopcartsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOneByUserId(@CurrentUser() user: UserEntity): Promise<ShopCartDto> {
    return this.shopCartsService.findOneByUserId(user.id);
  }
}
