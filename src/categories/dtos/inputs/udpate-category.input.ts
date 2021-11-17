import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';
import { IsString } from 'class-validator';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
