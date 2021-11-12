import { ShopCart } from '.prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { ShopCartModel } from 'src/shopcarts/models/shopcart.model';

@ObjectType()
export class UserProfileModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => ShopCartModel)
  shopCart: ShopCart;

  // @Field()
  // orders?: Order;
}
