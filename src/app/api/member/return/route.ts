/**
 * @swagger
 *   put:
 *     summary: Return a borrowed book
 *     description: Allows a member to return a borrowed book.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Book code is required
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const { bookCode } = await req.json();

  if (!bookCode) {
    return NextResponse.json({ message: "Book code is required" }, { status: 400 });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { code: bookCode },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (!book.isBorrowed) {
      return NextResponse.json({ message: "This book is not currently borrowed" }, { status: 400 });
    }

    await prisma.book.update({
      where: { code: bookCode },
      data: { isBorrowed: false, memberId: null, stock: book.stock + 1 },
    });

    return NextResponse.json({ message: "Book returned successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error returning the book" }, { status: 500 });
  }
}
