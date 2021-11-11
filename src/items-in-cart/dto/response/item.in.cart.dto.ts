import { ItemsInCart, Product } from '.prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsObject } from 'class-validator';
import { InfoPaginationDto } from 'src/common/dtos/info-pagination.dto';
import { ProductInfoDto } from 'src/products/dto/product-info.dto';

@Exclude()
export class ItemInCartDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly quantity: number;

  @Expose()
  @Type(() => ProductInfoDto)
  readonly product: Product;
}
