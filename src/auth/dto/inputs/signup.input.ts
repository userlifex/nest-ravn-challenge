import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  readonly password: string;
}
