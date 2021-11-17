import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateItemInCartModel {
  @Field({ nullable: true })
  userId: string;

  @Field({ nullable: true })
  productId: string;

  @Field({ nullable: true })
  quantity: number;
}
