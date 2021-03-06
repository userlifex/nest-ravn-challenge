import { IsInt } from 'class-validator';

export class InfoPaginationDto {
  @IsInt()
  readonly perPage: number;

  @IsInt()
  readonly total: number;

  @IsInt()
  readonly page: number;

  @IsInt()
  readonly prevPage: number;

  @IsInt()
  readonly nextPage: number;

  @IsInt()
  readonly totalPages: number;
}
