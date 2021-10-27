import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { IBaseDto } from 'src/interfaces/base-dto.interface';

export class InfoCategoryDto implements IBaseDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: Date;

  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: Date;
}
