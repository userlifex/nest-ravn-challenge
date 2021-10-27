import { IsInt, IsOptional } from 'class-validator';
import { IBaseDto } from 'src/interfaces/base-dto.interface';

export class PrismaPaginationDto implements IBaseDto {
  @IsInt()
  readonly skip: number;

  @IsInt()
  readonly take: number;
}
