import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field({ nullable: true })
  @IsOptional()
  readonly categoryId?: string;

  @Field()
  @IsString()
  readonly name: string;

  @Field(() => Float)
  @IsNumber()
  readonly price: number;

  @Field(() => Int)
  @IsNumber()
  readonly stock: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly description: string;

  @Field(() => Int, { defaultValue: 0 })
  @IsNumber()
  readonly numLikes: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly imageUrl: string;
}
