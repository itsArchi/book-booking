// src/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  // Seed Books
  const books = [
    {
      code: "JK-45",
      title: "Harry Potter",
      author: "J.K Rowling",
      stock: 1,
    },
    {
      code: "SHR-1",
      title: "A Study in Scarlet",
      author: "Arthur Conan Doyle",
      stock: 1,
    },
    {
      code: "TW-11",
      title: "Twilight",
      author: "Stephenie Meyer",
      stock: 1,
    },
    {
      code: "HOB-83",
      title: "The Hobbit, or There and Back Again",
      author: "J.R.R. Tolkien",
      stock: 1,
    },
    {
      code: "NRN-7",
      title: "The Lion, the Witch and the Wardrobe",
      author: "C.S. Lewis",
      stock: 1,
    },
  ];

  // Seed Members
  const members = [
    { code: "M001", name: "Angga" },
    { code: "M002", name: "Ferry" },
    { code: "M003", name: "Putri" },
  ];

  // Insert mock data into the database
  for (const book of books) {
    await prisma.book.create({ data: book });
  }

  for (const member of members) {
    await prisma.member.create({ data: member });
  }

  console.log("Mock data has been seeded!");
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
