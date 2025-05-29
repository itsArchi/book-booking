/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET BORROWED BOOKS
export async function GET(req: NextRequest) {
  const memberCode = req.nextUrl.searchParams.get("memberCode");

  if (!memberCode) {
    return NextResponse.json({ message: 'Member code is required' }, { status: 400 });
  }

  try {
    const member = await prisma.member.findUnique({
      where: { code: memberCode },
      include: { books: true },
    });

    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }

    const borrowedBooks = member.books.filter((book) => book.isBorrowed);

    return NextResponse.json(borrowedBooks);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch borrowed books' }, { status: 500 });
  }
}
