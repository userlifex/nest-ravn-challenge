import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { Public } from '../../common/decorators/public.decorator';
import { ProductArgs } from '../dtos/args/product.args';
import { CreateProductDto } from '../dtos/request/create-product.dto';
import { CreateProductInput } from '../dtos/inputs/create-product.input';
import { UpdateProductInput } from '../dtos/inputs/update-product.input';
import {
  CursorPaginatedProducts,
  PaginatedProducts,
  ProductModel,
} from '../dtos/models/product.model';
import { UpdateProductDto } from '../dtos/request/update-product.dto';
import { ProductsService } from '../services/products.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/decorators/role.decorator';
import { Roles } from '@prisma/client';
import { CursorPagination } from '../../common/dtos/args/cursor-pagination.args';
import { ApiLayer } from '../../utils';

@Resolver(() => ProductModel)
export class ProductResolver {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Query(() => CursorPaginatedProducts)
  async getAllProducts(@Args() args: CursorPagination) {
    const productsRsp = await this.productsService.find(args, ApiLayer.GQL);

    return productsRsp;
  }

  @Public()
  @Query(() => PaginatedProducts)
  async getProductsByCategory(@Args() args: ProductArgs) {
    const { page, perPage, categoryId } = args;
    const productsRsp = await this.productsService.findManyByCategory(
      categoryId,
      { page, perPage },
    );
    return productsRsp;
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.moderator)
  @Mutation(() => ProductModel)
  async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<ProductModel> {
    const dto = plainToClass(CreateProductDto, input);
    const productRsp = await this.productsService.create(dto);

    return plainToClass(ProductModel, productRsp);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.moderator)
  @Mutation(() => ProductModel)
  async updateProduct(
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductModel> {
    const dto = plainToClass(UpdateProductDto, input);
    const productRsp = await this.productsService.update(id, dto);

    return plainToClass(ProductModel, productRsp);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role(Roles.moderator)
  @Mutation(() => ProductModel)
  async deleteProduct(@Args('id') id: string): Promise<ProductModel> {
    const product = await this.productsService.delete(id);
    return plainToClass(ProductModel, product);
  }
  // @Query(() => any)
  // async findPosts(@Args() args: PaginationArgs): Promise<any> {
  //   return this.productsService.find(args);
  // }
}
