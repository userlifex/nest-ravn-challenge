import { BadRequestException } from '@nestjs/common';
import { InfoPaginationDto } from '../common/dtos/info-pagination.dto';
import { InputPaginationDto } from '../common/dtos/input-pagination.dto';
import { PrismaPaginationDto } from '../common/dtos/prisma-pagination.dto';

export const paginateParams = ({
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

export const paginationSerializer = (
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

const foo = () => {
  const irrelevantData = { price: 0, stock: 10 };
  const products = [
    {
      name: 'p1',
      ...irrelevantData,
    },
    {
      name: 'p2',
      ...irrelevantData,
    },
    {
      name: 'p3',
      ...irrelevantData,
    },
    {
      name: 'p4',
      ...irrelevantData,
    },
    {
      name: 'p5',
      ...irrelevantData,
    },
    {
      name: 'p6',
      ...irrelevantData,
    },
  ];

  //const p1 = await prismaService.product.create({ data: { ...products[0] } });
  //const p2 = await prismaService.product.create({ data: { ...products[1] } });
  //const p3 = await prismaService.product.create({ data: { ...products[2] } });
  //const p4 = await prismaService.product.create({ data: { ...products[3] } });
  //const p5 = await prismaService.product.create({ data: { ...products[4] } });
  //const p6 = await prismaService.product.create({ data: { ...products[5] } });
};
