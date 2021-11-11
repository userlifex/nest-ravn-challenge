import { ItemsInCart } from '.prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { ItemInCartModel } from 'src/items-in-cart/dto/models/items-in-cart.model';
import { ItemInCartDto } from 'src/items-in-cart/dto/response/item.in.cart.dto';

@ObjectType()
export class ShopCartModel {
  @Field()
  readonly id: string;

  @Field(() => ItemInCartModel)
  readonly items: ItemsInCart[];
}
