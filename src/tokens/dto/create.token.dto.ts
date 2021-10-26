export class CreateTokenDto {
  readonly token: string;

  readonly expirationDate: Date;

  readonly userId: string;
}
