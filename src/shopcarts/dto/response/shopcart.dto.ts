import { ItemsInCart } from '.prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ItemInCartDto } from 'src/items-in-cart/dto/response/item.in.cart.dto';

@Exclude()
export class ShopCartDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => ItemInCartDto)
  itemsInCart: ItemsInCart[];
}
