import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { RestPaginatedType } from '../../../common/dtos/rest-pagination.dto';
import { InfoCategoryDto } from '../../../categories/dtos/response/info-category.dto';

@Exclude()
export class ProductInfoDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly category: InfoCategoryDto;

  @Expose()
  readonly name: string;

  @Expose()
  @Type(() => Number)
  readonly price: number;

  @Expose()
  readonly stock: number;

  @Expose()
  readonly imgUrl: string;

  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: Date;

  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: Date;
}

@Exclude()
export class PaginatedProduct extends RestPaginatedType(ProductInfoDto) {}
