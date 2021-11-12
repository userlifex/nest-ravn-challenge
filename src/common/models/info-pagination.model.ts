import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@ObjectType()
export class InfoPaginationModel {
  @Field(() => Int)
  readonly perPage: number;

  @Field(() => Int)
  readonly total: number;

  @Field(() => Int)
  readonly page: number;

  @Field(() => Int)
  readonly prevPage: number;

  @Field(() => Int)
  readonly nextPage: number;

  @Field(() => Int)
  readonly totalPages: number;
}
