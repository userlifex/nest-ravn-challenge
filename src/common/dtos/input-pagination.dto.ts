import { IsInt, IsOptional } from 'class-validator';

export class InputPaginationDto {
  @IsOptional()
  @IsInt()
  readonly userId?: string;

  @IsOptional()
  @IsInt()
  readonly page: number;

  @IsOptional()
  @IsInt()
  readonly perPage: number;
}
