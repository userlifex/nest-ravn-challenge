import { ItemsInCart, Product } from '.prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { InfoPaginationDto } from 'src/common/dtos/info-pagination.dto';

@Exclude()
export class ItemInCartDto {
  @Expose()
  readonly id: InfoPaginationDto;

  @Expose()
  readonly product: Product;

  @Expose()
  readonly quantity: number;
}
