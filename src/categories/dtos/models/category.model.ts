import { Field, ObjectType } from '@nestjs/graphql';
import { CursorPaginated } from 'src/common/dtos/args/cursor-pagination.args';
import { GqlPaginatedType } from 'src/common/dtos/gql-pagination.model';

@ObjectType()
export class CategoryModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@ObjectType()
export class PaginatedCategories extends GqlPaginatedType(CategoryModel) {}

@ObjectType('CursorPaginatedCategories')
export class CursorPaginatedCategories extends CursorPaginated(CategoryModel) {}
