import { Exclude, Expose, Transform } from 'class-transformer';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { InfoCategoryDto } from 'src/categories/dto/info-category.dto';
import { IBaseDto } from 'src/interfaces/base-dto.interface';

@Exclude()
export class ProductInfoDto implements IBaseDto {
  @Expose()
  @IsString()
  readonly id: string;

  @Expose()
  @IsObject()
  readonly category: InfoCategoryDto;

  @Expose()
  @IsString()
  readonly name: string;

  @Expose()
  @Transform(({ value }) => value ?? 0)
  @IsOptional()
  //@IsNumber({ allowNaN: true, maxDecimalPlaces: 2 })
  readonly price: number;

  @Expose()
  @IsInt({})
  readonly stock: number;

  @Expose()
  @IsString()
  readonly imgUrl: string;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: Date;
}
