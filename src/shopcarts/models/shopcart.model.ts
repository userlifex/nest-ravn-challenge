import { ItemsInCart } from '.prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { ItemInCartModel } from '../../items-in-cart/models/items-in-cart.model';

@ObjectType()
export class ShopCartModel {
  @Field()
  readonly id: string;

  @Field(() => [ItemInCartModel])
  readonly itemsInCart: ItemsInCart[];
}
