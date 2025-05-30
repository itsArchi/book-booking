/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @swagger
 *   get:
 *     summary: Get borrowed books of a member
 *     description: Fetches the borrowed books for a given member.
 *     parameters:
 *       - in: query
 *         name: memberCode
 *         required: true
 *         description: The unique code of the member
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of borrowed books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   isBorrowed:
 *                     type: boolean
 *       400:
 *         description: Member code is required
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */

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
