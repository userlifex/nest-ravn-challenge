import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { InfoCategoryDto } from '../../categories/dto/info-category.dto';

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

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: Date;
}
