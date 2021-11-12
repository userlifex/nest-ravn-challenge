import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { InfoPaginationModel } from '../models/info-pagination.model';

export interface IPaginatedType<T> {
  pageInfo: InfoPaginationModel;
  data: T[];
}

export function GqlPaginatedType<T>(
  classType: Type<T>,
): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class GqlPaginatedType implements IPaginatedType<T> {
    @Field({ nullable: true })
    pageInfo: InfoPaginationModel;

    @Field(() => [classType], { nullable: true })
    data: T[];
  }

  return GqlPaginatedType as Type<IPaginatedType<T>>;
}
