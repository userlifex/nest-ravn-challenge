import { ItemsInCart } from '.prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ShopCartDto {
  @Expose()
  id: string;

  @Expose()
  items: ItemsInCart[];
}
