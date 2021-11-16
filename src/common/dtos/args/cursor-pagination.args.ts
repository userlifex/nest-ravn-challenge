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
  node: T;
  cursor: string;
}

export interface IPageInfo {
  startCursor: string;
  endCursor: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IPaginatedResponse<T> {
  edges: IEdgeType<T>[];
  pageInfo: IPageInfo;
}

export function getEdges<T extends { id?: string }>(
  nodes: Array<T>,
): Array<IEdgeType<T>> {
  return nodes.map((node) => ({ node, cursor: node.id }));
}

export function CursorPaginated<T>(
  classRef: Type<T>,
): Type<IPaginatedResponse<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType(`${classRef.name}PageInfo`)
  abstract class PageInfo {
    @Field(() => String, { nullable: true })
    public startCursor: string;

    @Field(() => String, { nullable: true })
    public endCursor: string;

    @Field(() => Boolean)
    public hasPreviousPage: boolean;

    @Field(() => Boolean)
    public hasNextPage: boolean;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedResponse<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;
  }

  return PaginatedType as Type<IPaginatedResponse<T>>;
}
