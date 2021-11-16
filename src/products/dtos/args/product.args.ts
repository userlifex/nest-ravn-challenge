import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';

@ArgsType()
export class ProductArgs extends PaginationArgs {
  @Field({ defaultValue: '' })
  @IsOptional()
  @IsString()
  readonly id?: string;

  @Field({ defaultValue: '' })
  @IsOptional()
  @IsString()
  readonly categoryId?: string;
}
