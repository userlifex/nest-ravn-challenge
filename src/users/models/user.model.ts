import { Roles, ShopCart } from '.prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { ShopCartModel } from '../../shopcarts/models/shopcart.model';

@ObjectType()
export class UserModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Roles)
  roles: Roles;

  @Field(() => ShopCartModel)
  shopCart: ShopCart;

  // @Field()
  // orders?: Order;
}
