import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LikeModel {
  @Field()
  readonly id: string;

  @Field()
  readonly userId: string;

  @Field()
  readonly productId: string;

  @Field()
  readonly createdAt: string;

  @Field()
  readonly updatedAt: string;
}
