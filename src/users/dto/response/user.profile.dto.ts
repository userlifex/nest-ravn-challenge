import { Order, ShopCart } from '.prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserProfileDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  shopCart: ShopCart;

  @Expose()
  orders?: Order;
}
