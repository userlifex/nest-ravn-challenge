import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TokenDto {
  readonly id: string;

  @Expose()
  @IsNotEmpty()
  readonly token: string;

  @Expose()
  @IsNotEmpty()
  readonly expirationDate: Date;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly userId: string;
}
