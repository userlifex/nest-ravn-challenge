import { Product } from '.prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GqlPaginatedType } from 'src/common/dtos/gql-pagination.model';
import { ProductModel } from 'src/products/dto/models/product.model';

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
