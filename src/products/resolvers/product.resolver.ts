import { Query } from '@nestjs/common';
import { Args, Int, Resolver } from '@nestjs/graphql';
import { PaginationArgs } from '../dto/args/pagination.args';
import { ProductModel } from '../dto/models/product.model';
import { ProductsService } from '../services/products.service';

@Resolver(() => ProductModel)
export class ProductResolver {
  constructor(private productsService: ProductsService) {}

  // @Query(() => any)
  // async findPosts(@Args() args: PaginationArgs): Promise<any> {
  //   return this.productsService.find(args);
  // }
}
