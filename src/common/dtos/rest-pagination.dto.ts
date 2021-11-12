import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { InfoPaginationDto } from './info-pagination.dto';

export interface IPaginatedType<T> {
  pageInfo: InfoPaginationDto;
  data: T[];
}

export function RestPaginatedType<T>(
  classType: Type<T>,
): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class RestPaginatedType implements IPaginatedType<T> {
    @Field({ nullable: true })
    pageInfo: InfoPaginationDto;

    @Field(() => [classType], { nullable: true })
    data: T[];
  }

  return RestPaginatedType as Type<IPaginatedType<T>>;
}
