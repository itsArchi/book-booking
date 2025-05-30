/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @swagger
 *   put:
 *     summary: Borrow a book
 *     description: Allows a member to borrow a book, given the member's code and the book's code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberCode:
 *                 type: string
 *               bookCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: Both memberCode and bookCode are required
 *       404:
 *         description: Member or Book not found
 *       500:
 *         description: Internal server error
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs"; 
import { swaggerSetup } from '../../../../utils/swagger';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req: NextRequest, res: NextResponse) => {
  if (req.method === 'GET') {
    return swaggerSetup(req, res);
  }

  res.status(200).json({ message: 'Normal API response' });
};

export default handler;

// BORROW BOOK
export async function PUT(req: NextRequest) {
  const { memberCode, bookCode } = await req.json();

  if (!memberCode || !bookCode) {
    return NextResponse.json({ message: "Both memberCode and bookCode are required" }, { status: 400 });
  }

  try {
    const member = await prisma.member.findUnique({
      where: { code: memberCode },
      include: { books: true },
    });

    if (!member) throw new Error('Member not found');
    if (member.books.length >= 2) throw new Error('Member has already borrowed 2 books');
    if (member.penaltyUntil && dayjs().isBefore(dayjs(member.penaltyUntil))) {
      throw new Error('Member is currently under penalty');
    }

    const book = await prisma.book.findUnique({
      where: { code: bookCode },
    });

    if (!book) throw new Error('Book not found');
    if (book.isBorrowed) throw new Error('Book is already borrowed');

    // Borrow the book
    await prisma.book.update({
      where: { code: bookCode },
      data: { isBorrowed: true, memberId: member.id, stock: book.stock - 1 },
    });

    return NextResponse.json({ message: "Book borrowed successfully" });
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Error borrowing book' }, { status: 500 });
  }
}

// RETURN BOOK
export async function PUT_RETURN(req: NextRequest) {
  const { bookCode } = await req.json();

  if (!bookCode) {
    return NextResponse.json({ message: 'Book code is required' }, { status: 400 });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { code: bookCode },
    });

    if (!book) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    if (!book.isBorrowed) {
      return NextResponse.json({ message: 'This book is not currently borrowed' }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: { id: book.memberId },
    });

    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }

    const borrowedDate = book.borrowedAt ? dayjs(book.borrowedAt) : dayjs();
    const returnDate = dayjs();
    const diffDays = returnDate.diff(borrowedDate, 'day');

    let penaltyMessage = '';
    if (diffDays > 7) {
      // Member is penalized
      penaltyMessage = 'You have incurred a penalty for returning the book late';
      await prisma.member.update({
        where: { id: member.id },
        data: { penaltyUntil: returnDate.add(3, 'days').toDate() }, 
      });
    }

    await prisma.book.update({
      where: { code: bookCode },
      data: { isBorrowed: false, memberId: null, stock: book.stock + 1 },
    });

    return NextResponse.json({ message: `Book returned successfully. ${penaltyMessage}` });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: 'Error returning the book' }, { status: 500 });
  }
}

// GET ALL BOOKS 
export async function GET(req: NextRequest) {
  try {
    const books = await prisma.book.findMany({
      where: {
        isBorrowed: false,
      },
    });
    return NextResponse.json(books);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching books" }, { status: 500 });
  }
}

// GET MEMBER BY CODE 
export async function GET_MEMBER(req: NextRequest) {
  try {
    const members = await prisma.member.findMany({
      include: {
        books: true,  
      },
    });

    return NextResponse.json(members);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching members" }, { status: 500 });
  }
}

// UPDATE MEMBER
export async function PUT_MEMBER(req: NextRequest) {
  const { memberCode, name } = await req.json();

  if (!memberCode || !name) {
    return NextResponse.json({ message: 'Member code and name are required' }, { status: 400 });
  }

  try {
    const updatedMember = await prisma.member.update({
      where: { code: memberCode },
      data: { name },
    });

    return NextResponse.json(updatedMember);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating member' }, { status: 500 });
  }
}

// DELETE MEMBER
export async function DELETE_MEMBER(req: NextRequest) {
  const { memberCode } = await req.json();

  if (!memberCode) {
    return NextResponse.json({ message: 'Member code is required' }, { status: 400 });
  }

  try {
    await prisma.member.delete({
      where: { code: memberCode },
    });

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting member' }, { status: 500 });
  }
}
