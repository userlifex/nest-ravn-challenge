import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsObject, IsOptional } from 'class-validator';
import { CategoryModel } from '../../../categories/dtos/models/category.model';
import { GqlPaginatedType } from '../../../common/dtos/gql-pagination.model';

@ObjectType()
export class ProductModel {
  @Field()
  readonly id: string;

  @Field({ nullable: true })
  @IsObject()
  readonly category: CategoryModel;

  @Field()
  readonly name: string;

  @Field(() => Float)
  @Type(() => Number)
  @IsOptional()
  readonly price: number;

  @Field(() => Int)
  @IsOptional()
  readonly stock: number;

  @Field({ nullable: true })
  readonly imgUrl: string;

  @Field()
  readonly createdAt: string;

  @Field()
  readonly updatedAt: string;
}

@ObjectType()
export class PaginatedProducts extends GqlPaginatedType(ProductModel) {}
