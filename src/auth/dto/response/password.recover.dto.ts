import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PasswordRecoverDto {
  @Expose()
  readonly message: string;
}
