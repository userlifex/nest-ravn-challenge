import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { Category, PrismaClient } from '@prisma/client';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

async function main() {
  const hashPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  };

  const prisma = new PrismaClient();

  const dropData = async () => {
    await prisma.category.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.shopCart.deleteMany({});
    await prisma.token.deleteMany({});
    await prisma.user.deleteMany({});
  };

  await dropData();

  const pass1 = await hashPassword('pass');
  const customer = await prisma.user.create({
    data: {
      name: 'jon',
      email: 'jon@mail.co',
      password: pass1,
      shopCart: {
        create: {},
      },
    },
  });

  const moderator = await prisma.user.create({
    data: {
      name: 'mod',
      email: 'admin@mail.co',
      password: pass1,
      roles: 'moderator',
    },
  });

  console.log(customer, moderator);

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

  const prismaCategories = [];

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
