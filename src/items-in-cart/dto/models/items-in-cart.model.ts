import { Product } from '.prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
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
