import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CursorPaginated } from '../../../common/dtos/args/cursor-pagination.args';
import { ItemOrderedModel } from '../../../items-ordered/dtos/models/item-ordered.model';

@ObjectType()
export class OrderModel {
  @Field()
  readonly id: string;

  @Field()
  readonly userId: string;

  @Field((type) => Float)
  @IsNumber()
  readonly total: number;

  @Field()
  readonly createdAt: string;

  @Field()
  readonly updatedAt: string;

  @Field((type) => [ItemOrderedModel], { nullable: true })
  readonly itemsOrdered?: ItemOrderedModel[];
}

@ObjectType()
export class CursorPaginatedOrders extends CursorPaginated(OrderModel) {}
