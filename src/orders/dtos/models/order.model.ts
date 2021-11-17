import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ItemOrderedModel } from '../../../items-ordered/dtos/models/item-ordered.model';

@ObjectType()
export class OrderModel {
  @Field()
  readonly id: string;

  @Field()
  readonly userId: string;

  @Field((type) => Float)
  readonly total: number;

  @Field()
  readonly createdAt: string;

  @Field()
  readonly updatedAt: string;

  @Field((type) => [ItemOrderedModel], { nullable: true })
  readonly itemsOrdered?: ItemOrderedModel[];
}
