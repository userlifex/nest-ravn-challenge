import { Category, PrismaClient } from '@prisma/client';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

async function main() {
  const prisma = new PrismaClient();

  const dropData = async () => {
    await prisma.category.deleteMany({});
    await prisma.product.deleteMany({});
  };

  await dropData();

  const categories: CreateCategoryDto[] = [
    {
      name: 'chocolates',
    },
    {
      name: 'dulcecitos',
    },
    {
      name: 'candy',
    },
  ];

  let prismaCategories = [];

  for (let i = 0; i < categories.length; i++) {
    const cat = await prisma.category.create({ data: { ...categories[i] } });
    prismaCategories.push(cat);
  }

  const products = [
    {
      name: 'leche',
    },
    {
      name: 'durazno',
    },
    {
      name: 'sublime',
    },
    {
      name: 'triagunlo',
    },
    {
      name: 'chocman',
    },
    {
      name: 'likes',
    },
  ];

  products.forEach(async (item) => {
    const rand = Number.parseInt(Number(Math.random() * 3) + '');
    const categoryId = prismaCategories[rand].id;
    const prod = await prisma.product.create({
      data: {
        categoryId,
        name: item.name,
        stock: Number.parseInt('' + Math.random() * 40),
        price: Math.random() * 40,
      },
    });
  });

  await prisma.product.create({
    data: {
      name: 'no category',
      stock: 0,
      price: 12.1,
    },
  });
}

main();
