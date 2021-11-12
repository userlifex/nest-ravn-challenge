import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductModel {
  @Field()
  readonly id: string;

  @Field()
  readonly name: string;

  @Field(() => Float)
  readonly price: number;
}
