import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field()
  readonly id: string;

  @Field()
  readonly name: string;

  @Field()
  readonly email: string;
}
