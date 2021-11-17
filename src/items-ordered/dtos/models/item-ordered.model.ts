import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ItemOrderedModel {
  @Field()
  readonly id: string;

  @Field()
  readonly productId: string;

  @Field()
  readonly orderId: string;

  @Field((type) => Int)
  readonly quantity: number;

  @Field((type) => Float)
  readonly sellPrice: number;

  @Field((type) => Float)
  readonly subTotal: number;

  @Field()
  readonly createdAt: string;

  @Field()
  readonly updatedAt: string;
}
