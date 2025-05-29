import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET MEMBER BY CODE
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");  // Get code from the query parameters

  try {
    if (code) {
      // If the code is provided, fetch the member with that code
      const member = await prisma.member.findUnique({
        where: { code },
      });

      if (!member) {
        return NextResponse.json({ message: "Member not found" }, { status: 404 });
      }

      return NextResponse.json(member); // Return the member with the provided code
    } else {
      // If no code is provided, fetch all members
      const members = await prisma.member.findMany();
      return NextResponse.json(members);  // Return all members
    }
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching members" }, { status: 500 });
  }
}

// CREATE MEMBER
export async function POST(req: NextRequest) {
  const { code, name } = await req.json();

  try {
    const newMember = await prisma.member.create({
      data: { code, name },
    });
    return NextResponse.json(newMember);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: "Error creating member" }, { status: 500 });
  }
}

// UPDATE MEMBER
export async function PUT(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code"); // Get code from query params
  const { name } = await req.json(); // Assuming only name is being updated

  if (!code || !name) {
    return NextResponse.json({ message: "Code and name are required" }, { status: 400 });
  }

  try {
    const updatedMember = await prisma.member.update({
      where: { code },
      data: { name },
    });

    return NextResponse.json(updatedMember); // Return the updated member
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: "Error updating member" }, { status: 500 });
  }
}

// DELETE MEMBER
export async function DELETE(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ message: "Code is required" }, { status: 400 });
  }

  try {
    await prisma.member.delete({
      where: { code },
    });

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: "Error deleting member" }, { status: 500 });
  }
}

// BORROW BOOK
export async function PUT_BORROW(req: NextRequest) {
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

    const book = await prisma.book.findUnique({
      where: { code: bookCode },
    });

    if (!book) throw new Error('Book not found');
    if (book.isBorrowed) throw new Error('Book is already borrowed');

    // Mark book as borrowed and update the stock
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

    // Update book stock and mark it as available
    await prisma.book.update({
      where: { code: bookCode },
      data: { isBorrowed: false, memberId: null, stock: book.stock + 1 },
    });

    return NextResponse.json({ message: 'Book returned successfully' });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: 'Error returning the book' }, { status: 500 });
  }
}
