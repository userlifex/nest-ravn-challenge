import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class InputPaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly first?: number;

  @IsOptional()
  @IsString()
  readonly after?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly page?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly perPage?: number;
}
