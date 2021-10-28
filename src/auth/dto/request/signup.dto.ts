import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpData {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  readonly password: string;
}
