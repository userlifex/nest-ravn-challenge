import { IsObject } from 'class-validator';
import { InfoPaginationDto } from '../../../common/dtos/info-pagination.dto';
import { InfoCategoryDto } from './info-category.dto';

export class CollectionCategoryDto {
  @IsObject()
  readonly pageInfo: InfoPaginationDto;

  @IsObject()
  readonly data: InfoCategoryDto[];
}
