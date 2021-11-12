import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InfoPaginationModel {
  @Field(() => Int)
  readonly perPage: number;

  @Field(() => Int)
  readonly total: number;

  @Field(() => Int)
  readonly page: number;

  @Field(() => Int, { nullable: true })
  readonly prevPage: number;

  @Field(() => Int, { nullable: true })
  readonly nextPage: number;

  @Field(() => Int)
  readonly totalPages: number;
}
