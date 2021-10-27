import { IsObject } from 'class-validator';
import { IBaseDto } from 'src/interfaces/base-dto.interface';
import { InfoPaginationDto } from 'src/common/dtos/info-pagination.dto';
import { InfoCategoryDto } from './info-category.dto';

export class CollectionCategoryDto implements IBaseDto {
  @IsObject()
  readonly pageInfo: InfoPaginationDto;

  @IsObject()
  readonly data: InfoCategoryDto[];
}
