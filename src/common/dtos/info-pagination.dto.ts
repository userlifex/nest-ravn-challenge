import { IsInt } from 'class-validator';
import { IBaseDto } from 'src/interfaces/base-dto.interface';

export class InfoPaginationDto implements IBaseDto {
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
