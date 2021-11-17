import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PrismaPaginationDto {
  @IsInt()
  @IsPositive()
  readonly skip: number;

  @IsInt()
  @IsPositive()
  readonly take: number;
}
