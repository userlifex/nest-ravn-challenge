import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateCategoryInput {
  @Field()
  @IsString()
  name: string;
}
