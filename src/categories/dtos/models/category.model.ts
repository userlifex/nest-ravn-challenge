import { Field, ObjectType } from '@nestjs/graphql';
import { GqlPaginatedType } from '../../../common/dtos/gql-pagination.model';
import { CursorPaginated } from 'src/common/dtos/args/cursor-pagination.args';


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
