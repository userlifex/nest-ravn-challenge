import { IBaseDto } from './base-dto.interface';

export interface ICrud<T> {
  find(): Promise<T[]>;

  findOneById(id: string): Promise<T>;

  create(input: IBaseDto): Promise<T>;

  update(id: string, input: IBaseDto): Promise<T>;

  delete(id: string): Promise<T>;
}
