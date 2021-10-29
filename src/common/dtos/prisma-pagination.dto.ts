import { IsInt, IsOptional } from 'class-validator';

export class PrismaPaginationDto {
  @IsInt()
  readonly skip: number;

  @IsInt()
  readonly take: number;
}
