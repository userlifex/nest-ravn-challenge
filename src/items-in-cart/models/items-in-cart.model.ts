import { Product } from '.prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CursorPaginated } from 'src/common/dtos/args/cursor-pagination.args';
import { GqlPaginatedType } from 'src/common/dtos/gql-pagination.model';
import { ProductModel } from 'src/products/dtos/models/product.model';

@ObjectType()
export class ItemInCartModel {
  @Field()
  readonly id: string;

  @Field(() => Int)
  readonly quantity: number;

  @Field(() => ProductModel)
  readonly product: Product;
}

@ObjectType('PaginatedItemsInCart')
export class PaginatedItemsInCart extends GqlPaginatedType(ItemInCartModel) {}

@ObjectType('CursorPaginatedItemsInCart')
export class CursorPaginatedItemsInCart extends CursorPaginated(
  ItemInCartModel,
) {}
