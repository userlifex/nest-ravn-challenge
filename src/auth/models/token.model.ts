import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenModel {
  @Field()
  readonly access_token: string;
}
