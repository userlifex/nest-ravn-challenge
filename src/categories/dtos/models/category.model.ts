import { Field, ObjectType } from '@nestjs/graphql';
import { GqlPaginatedType } from '../../../common/dtos/gql-pagination.model';

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
