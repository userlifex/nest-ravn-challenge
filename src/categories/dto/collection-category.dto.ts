import { IsObject } from 'class-validator';
import { InfoPaginationDto } from 'src/common/dtos/info-pagination.dto';
import { InfoCategoryDto } from './info-category.dto';

export class CollectionCategoryDto {
  @IsObject()
  readonly pageInfo: InfoPaginationDto;

  @IsObject()
  readonly data: InfoCategoryDto[];
}
