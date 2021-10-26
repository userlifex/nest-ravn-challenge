import {
  IsDecimal,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IBaseDto } from 'src/interfaces/base-dto.interface';

export class CreateProductDto implements IBaseDto {
  @IsOptional()
  @IsString()
  readonly categoryId: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly price: number;

  @IsInt()
  readonly stock: number;

  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly imageUrl: string;
}
