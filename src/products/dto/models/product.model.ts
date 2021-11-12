import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductModel {
  @Field()
  readonly id: string;

  @Field()
  readonly name: string;
}
