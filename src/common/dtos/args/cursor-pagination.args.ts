import { Type } from '@nestjs/common';
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class ICursorPagination {
  take?: number;
  after?: string;
}

@ArgsType()
export class CursorPagination extends ICursorPagination {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  take?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @IsNotEmpty()
  after?: string;
}

export interface IEdgeType<T> {
  cursor: string;
  node: T;
}

export interface IPaginatedResponse<T> {
  edges: IEdgeType<T>[];
  nodes: T[];
  totalCount: number;
  hasNextPage: boolean;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedResponse<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedResponse<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => [classRef], { nullable: true })
    nodes: T[];

    @Field(() => Int)
    totalCount: number;

    @Field()
    hasNextPage: boolean;
  }

  return PaginatedType as Type<IPaginatedResponse<T>>;
}
