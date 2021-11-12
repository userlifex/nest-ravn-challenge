import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { Public } from '../../common/decorators/public.decorator';
import { ProductArgs } from '../dtos/args/product.args';
import { CreateProductDto } from '../dtos/request/create-product.dto';
import { CreateProductInput } from '../dtos/inputs/create-product.input';
import { UpdateProductInput } from '../dtos/inputs/update-product.input';
import { PaginatedProducts, ProductModel } from '../dtos/models/product.model';
import { UpdateProductDto } from '../dtos/request/update-product.dto';
import { ProductsService } from '../services/products.service';

@Resolver(() => ProductModel)
export class ProductResolver {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Query(() => PaginatedProducts)
  async getAllProducts(@Args() args: ProductArgs) {
    const { page, perPage } = args;
    const productsRsp = await this.productsService.find({ page, perPage });
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

  @Public()
  @Mutation(() => ProductModel)
  async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<ProductModel> {
    const dto = plainToClass(CreateProductDto, input);
    const productRsp = await this.productsService.create(dto);

    return plainToClass(ProductModel, productRsp);
  }

  @Public()
  @Mutation(() => ProductModel)
  async updateProduct(
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductModel> {
    const dto = plainToClass(UpdateProductDto, input);
    const productRsp = await this.productsService.update(id, dto);

    return plainToClass(ProductModel, productRsp);
  }
  // @Query(() => any)
  // async findPosts(@Args() args: PaginationArgs): Promise<any> {
  //   return this.productsService.find(args);
  // }
}
