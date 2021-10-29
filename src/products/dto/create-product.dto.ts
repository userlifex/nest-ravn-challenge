import { Attachment } from '.prisma/client';
import {
  IsDecimal,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
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
  @IsInt()
  readonly numLikes: number;

  @IsOptional()
  @IsString()
  readonly lastLikeUserId: string;

  @IsOptional()
  @IsString()
  readonly imageUrl: string;
}
