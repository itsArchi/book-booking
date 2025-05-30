/**
 * @swagger
 *   get:
 *     summary: Get member by code
 *     description: Fetches a member by their unique code.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: The unique code for the member.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "12345"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *       400:
 *         description: Code parameter is required
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 *   post:
 *     summary: Create a new member
 *     description: Creates a new member by providing a code and name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 *   put:
 *     summary: Update member information
 *     description: Updates a member's name by providing their code and new name.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: The unique code of the member.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       400:
 *         description: Code and name are required
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 *   delete:
 *     summary: Delete a member
 *     description: Deletes a member by their unique code.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: The unique code for the member.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *       400:
 *         description: Code is required
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET MEMBER BY CODE
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code'); 
  
  if (!code) {
    return NextResponse.json({ message: 'Member code is required' }, { status: 400 });
  }
  
  try {
    const member = await prisma.member.findUnique({
      where: { code },
      select: { name: true }, 
    });

    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member); 
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json({ message: 'Error fetching member' }, { status: 500 });
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
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json({ message: 'Error creating member' }, { status: 500 });
  }
}

// UPDATE MEMBER
export async function PUT(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code'); 
  const { name } = await req.json(); 

  if (!code || !name) {
    return NextResponse.json({ message: 'Code and name are required' }, { status: 400 });
  }

  try {
    const updatedMember = await prisma.member.update({
      where: { code },
      data: { name },
    });

    return NextResponse.json(updatedMember); 
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ message: 'Error updating member' }, { status: 500 });
  }
}

// DELETE MEMBER
export async function DELETE(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ message: 'Code is required' }, { status: 400 });
  }

  try {
    await prisma.member.delete({
      where: { code },
    });

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json({ message: 'Error deleting member' }, { status: 500 });
  }
}

// BORROW BOOK
export async function PUT_BORROW(req: NextRequest) {
  const { memberCode, bookCode } = await req.json();

  if (!memberCode || !bookCode) {
    return NextResponse.json({ message: 'Both memberCode and bookCode are required' }, { status: 400 });
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

    await prisma.book.update({
      where: { code: bookCode },
      data: { isBorrowed: true, memberId: member.id, stock: book.stock - 1 },
    });

    return NextResponse.json({ message: 'Book borrowed successfully' });
  } catch (error) {
    console.error('Error borrowing book:', error);
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

    await prisma.book.update({
      where: { code: bookCode },
      data: { isBorrowed: false, memberId: null, stock: book.stock + 1 },
    });

    return NextResponse.json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error('Error returning the book:', error);
    return NextResponse.json({ message: 'Error returning the book' }, { status: 500 });
  }
}
