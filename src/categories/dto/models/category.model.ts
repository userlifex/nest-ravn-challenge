import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
