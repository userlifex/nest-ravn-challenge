import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class JWTPayload {
  @Expose()
  sub: string;

  @Expose()
  iat: Date;

  @Expose()
  exp: Date;
}
