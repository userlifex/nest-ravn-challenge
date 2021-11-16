import { BadRequestException } from '@nestjs/common';
import { IPageInfo } from 'src/common/dtos/args/cursor-pagination.args';
import { ItemInCartDto } from 'src/items-in-cart/dto/response/item.in.cart.dto';
import { InfoPaginationDto } from '../common/dtos/info-pagination.dto';
import { InputPaginationDto } from '../common/dtos/input-pagination.dto';
import { PrismaPaginationDto } from '../common/dtos/prisma-pagination.dto';

export enum ApiLayer {
  REST,
  GQL,
}

export const RESTpaginateParams = ({
  page,
  perPage,
}: InputPaginationDto): PrismaPaginationDto => {
  const nPage = page ?? 1;
  if (nPage <= 0) {
    throw new BadRequestException();
  }

  const nPerPage = perPage ?? 10;
  const take: number = nPerPage;
  const skip: number = (nPage - 1) * nPerPage;

  return { take, skip };
};

export const GQLpaginateParams = ({ first, after }: InputPaginationDto) => {
  const take = first ?? 10;
  let skip = undefined;
  let cursor = undefined;

  if (after) {
    skip = 1;
    cursor = {
      id: after,
    };
  }
  return { take, skip: skip, cursor: cursor };
};

export const RESTpaginationSerializer = (
  total: number,
  query: InputPaginationDto,
): InfoPaginationDto => {
  const { page, perPage } = query;
  const itemsPerPage = total >= perPage ? perPage : total;
  const totalPages = itemsPerPage > 0 ? Math.ceil(total / itemsPerPage) : null;
  const prevPage = page > 1 && page <= totalPages ? page - 1 : null;
  const nextPage = totalPages > 1 && page < totalPages ? page + 1 : null;

  return {
    page,
    perPage: itemsPerPage,
    total,
    prevPage,
    nextPage,
    totalPages,
  };
};

export function GQLpaginationSerializer<T extends { id: string }>(
  data: Array<T>,
  edge: Array<T>,
  query: InputPaginationDto,
): IPageInfo {
  const startCursor = edge[0].id;
  const endCursor = edge[edge.length - 1].id;

  const startIndex = data.findIndex((element) => element.id == startCursor);
  const endIndex = data.findIndex((element) => element.id == endCursor);
  const hasPreviousPage = startIndex > 0 ? true : false;
  const hasNextPage = endIndex < edge.length - 1 ? true : false;

  return {
    startCursor,
    endCursor,
    hasPreviousPage,
    hasNextPage,
  };
}

export function GQLPageSerializer<T extends { id: string }>(
  firstCursor: string,
  lastCursor: string,
  edge: Array<T>,
) {
  const startCursor = edge[0].id;
  const endCursor = edge[edge.length - 1].id;

  const hasPreviousPage = firstCursor !== startCursor ? true : false;
  const hasNextPage = lastCursor !== endCursor ? true : false;

  return {
    startCursor,
    endCursor,
    hasPreviousPage,
    hasNextPage,
  };
}
