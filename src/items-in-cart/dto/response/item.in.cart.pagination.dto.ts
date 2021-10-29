import { ItemsInCart, Product } from '.prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { InfoPaginationDto } from 'src/common/dtos/info-pagination.dto';
import { ItemInCartDto } from './item.in.cart.dto';

@Exclude()
export class ItemInCartPaginationDto {
  @Expose()
  readonly pageInfo: InfoPaginationDto;

  @Expose()
  readonly data: ItemInCartDto[];
}
