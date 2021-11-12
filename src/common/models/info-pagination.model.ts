import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@ObjectType()
export class InfoPaginationModel {
  @Field(() => Int, { nullable: true })
  readonly perPage: number;

  @Field(() => Int, { nullable: true })
  readonly total: number;

  @Field(() => Int, { nullable: true })
  readonly page: number;

  @Field(() => Int, { nullable: true })
  readonly prevPage: number;

  @Field(() => Int, { nullable: true })
  readonly nextPage: number;

  @Field(() => Int, { nullable: true })
  readonly totalPages: number;
}
