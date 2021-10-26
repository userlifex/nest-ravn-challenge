import { IsString } from 'class-validator';
import { IBaseDto } from 'src/interfaces/base-dto.interface';

export class CreateCategoryDto implements IBaseDto {
  @IsString()
  readonly name: string;
}
