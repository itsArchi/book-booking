import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function validateBookReturn(req: NextRequest) {
  const { bookCode } = await req.json();
  const memberCode = req.headers.get('memberCode');  

  if (!bookCode || !memberCode) {
    return NextResponse.json({ message: "Book code and member code are required" }, { status: 400 });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { code: bookCode },
      include: { member: true },  
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (!book.isBorrowed) {
      return NextResponse.json({ message: "This book is not currently borrowed" }, { status: 400 });
    }

    if (book.member && book.member.code !== memberCode) {
      return NextResponse.json({ message: "You are not authorized to return this book" }, { status: 403 });
    }

    return NextResponse.next(); 

  } catch (error) {
    console.error("Error validating book return:", error);
    return NextResponse.json({ message: "Error processing return validation" }, { status: 500 });
  }
}
