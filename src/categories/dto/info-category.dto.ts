import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class InfoCategoryDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: Date;

  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: Date;
}
