import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBooks = async () => {
  return await prisma.book.findMany({
    where: { isBorrowed: false },
  });
};

export const borrowBook = async (bookCode: string, memberCode: string) => {
  const book = await prisma.book.findUnique({ where: { code: bookCode } });
  const member = await prisma.member.findUnique({
    where: { code: memberCode },
    include: { books: true },  
  });

  if (!book || !member) throw new Error('Book or Member not found');
  if (book.isBorrowed) throw new Error('Book is already borrowed');
  if (member.books.length >= 2) throw new Error('Member has already borrowed 2 books');

  return await prisma.book.update({
    where: { code: bookCode },
    data: { isBorrowed: true, memberId: member.id },
  });
};

export const returnBook = async (bookCode: string, memberCode: string, daysLate: number) => {
  const book = await prisma.book.findUnique({ where: { code: bookCode } });
  const member = await prisma.member.findUnique({
    where: { code: memberCode },
    include: { books: true },  
  });

  if (!book || !member) throw new Error('Book or Member not found');
  if (book.isBorrowed && book.memberId !== member.id) throw new Error('Book not borrowed by this member');

  let penalty = 0;
  if (daysLate > 7) {
    penalty = 1;
    await prisma.member.update({
      where: { code: memberCode },
      data: { penalties: { increment: 1 } },
    });
    console.log(`Penalty applied: ${penalty}`);
  }

  return await prisma.book.update({
    where: { code: bookCode },
    data: { isBorrowed: false, memberId: null },
  });
};
