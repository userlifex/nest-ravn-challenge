import { IsInt, IsOptional } from 'class-validator';
import { IBaseDto } from 'src/interfaces/base-dto.interface';

export class InputPaginationDto implements IBaseDto {
  @IsOptional()
  @IsInt()
  readonly page: number;

  @IsOptional()
  @IsInt()
  readonly perPage: number;
}
