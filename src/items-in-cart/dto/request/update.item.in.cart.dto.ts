import { PartialType } from '@nestjs/mapped-types';
import { CreateItemInCartDto } from './create.item.in.cart.dto';

export class UpdateItemInCartDto extends PartialType(CreateItemInCartDto) {}
