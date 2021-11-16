import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class LikesArgs {
  @Field()
  readonly productId: string;

  @Field()
  readonly userId: string;
}
