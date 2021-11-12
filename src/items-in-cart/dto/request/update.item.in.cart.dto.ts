import { PartialType } from '@nestjs/swagger';
import { CreateItemInCartDto } from './create.item.in.cart.dto';

export class UpdateItemInCartDto extends PartialType(CreateItemInCartDto) {}
