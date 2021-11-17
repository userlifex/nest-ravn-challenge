import { Roles } from '.prisma/client';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt.guard';
import { Role } from '../../common/decorators/role.decorator';
import { RolesGuard } from '../../common/guards/role.guard';
import { UserEntity } from '../../common/types';
import { ApiLayer } from '../../utils';
import {
  CursorPaginatedItemsInCart,
  ItemInCartModel,
  PaginatedItemsInCart,
} from '../models/items-in-cart.model';
import { UpdateItemInCarModel } from '../models/update-items-in-cart.model';
import { ItemsInCartService } from '../services/items-in-cart.service';

@Resolver(() => ItemInCartModel)
export class ItemsInCartResolver {
  constructor(private readonly itemsInCartService: ItemsInCartService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.customer)
  @Mutation(() => ItemInCartModel, { name: 'addProductToCart' })
  async create(
    @CurrentUser() user: UserEntity,
    @Args('quantity') quantity: number,
    @Args('productId') productId: string,
  ): Promise<ItemInCartModel> {
    return this.itemsInCartService.create({
      userId: user.id,
      quantity,
      productId,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => CursorPaginatedItemsInCart)
  async getAll(
    @CurrentUser() user: UserEntity,
    @Args({ name: 'first', type: () => Int, nullable: true, defaultValue: 10 })
    first?: number,
    @Args({ name: 'after', nullable: true }) after?: string,
  ): Promise<CursorPaginatedItemsInCart | PaginatedItemsInCart> {
    return this.itemsInCartService.find(
      user.id,
      { first, after },
      ApiLayer.GQL,
    );
  }

  @Query(() => ItemInCartModel)
  async getOneById(@Args('itemId') itemId: string): Promise<ItemInCartModel> {
    return this.itemsInCartService.findOneById(itemId);
  }

  @Mutation(() => ItemInCartModel)
  async update(
    @Args('id') cartItemId: string,
    @Args('quantity') quantity: number,
  ): Promise<UpdateItemInCarModel> {
    return this.itemsInCartService.update(cartItemId, quantity);
  }

  @Mutation(() => ItemInCartModel)
  async delete(@Args('id') cartItemId: string): Promise<ItemInCartModel> {
    return this.itemsInCartService.delete(cartItemId);
  }
}
