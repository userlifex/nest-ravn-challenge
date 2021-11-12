import { PartialType } from '@nestjs/swagger';
import { CreateItemInCartModel } from './create-items-in-cart.model';

export class UpdateItemInCarModel extends PartialType(CreateItemInCartModel) {}
