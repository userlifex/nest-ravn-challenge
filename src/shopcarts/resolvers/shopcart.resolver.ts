import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserEntity } from '../../common/types';
import { ShopCartModel } from '../models/shopcart.model';
import { ShopcartsService } from '../services/shopcarts.service';

@Resolver(() => ShopCartModel)
export class ShopCartResolver {
  constructor(private shopcartService: ShopcartsService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => ShopCartModel)
  async findMyShopCart(
    @CurrentUser() user: UserEntity,
  ): Promise<ShopCartModel> {
    return this.shopcartService.findOneByUserId(user.id);
  }
}
