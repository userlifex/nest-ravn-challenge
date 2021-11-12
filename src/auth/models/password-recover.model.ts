import { Field, ObjectType } from '@nestjs/graphql';
import { Exclude, Expose } from 'class-transformer';

@ObjectType()
export class PasswordRecoverModel {
  @Field()
  readonly message: string;
}
