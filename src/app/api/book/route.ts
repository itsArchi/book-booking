/**
 * @swagger
 *   get:
 *     summary: Get all books or book by code
 *     description: Fetch all books or search for a book using its code.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: false
 *         description: The unique code of the book (optional).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of books or a single book by code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 stock:
 *                   type: integer
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new book
 *     description: Create a new book by providing code, title, author, and stock.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update book stock and details
 *     description: Update the details of a book, such as title, author, and stock.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: The unique code of the book
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Missing required fields or code
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a book
 *     description: Deletes a book by its unique code.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: The unique code of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       400:
 *         description: Code is required
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET BOOK BY CODE
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (code) {
    try {
      const book = await prisma.book.findUnique({
        where: { code },
      });

      if (!book) {
        return NextResponse.json({ message: "Book not found" }, { status: 404 });
      }

      return NextResponse.json(book);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Error fetching book by code" }, { status: 500 });
    }
  } else {
    try {
      const books = await prisma.book.findMany();
      return NextResponse.json(books);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Error fetching books" }, { status: 500 });
    }
  }
}

// CREATE BOOK
export async function POST(req: NextRequest) {
  const { code, title, author, stock } = await req.json();
  
  // Validation: Ensure required fields are provided
  if (!code || !title || !author || !stock) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  try {
    const newBook = await prisma.book.create({
      data: { code, title, author, stock },
    });
    return NextResponse.json(newBook);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating book" }, { status: 500 });
  }
}

// UPDATE BOOK STOCK
export async function PUT(req: NextRequest) {
  const { title, author, stock } = await req.json();
  const code = req.nextUrl.searchParams.get('code');  

  if (!code) {
    return NextResponse.json({ message: "Code parameter is required" }, { status: 400 });
  }

  if (!title || !author || !stock) {
    return NextResponse.json({ message: "Title, author, and stock are required" }, { status: 400 });
  }

  try {
    const existingBook = await prisma.book.findUnique({
      where: { code },
    });

    if (!existingBook) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const updatedBook = await prisma.book.update({
      where: { code },
      data: { title, author, stock },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json({ message: "Error updating book" }, { status: 500 });
  }
}

// DELETE BOOK
export async function DELETE(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code"); 

  if (!code) {
    return NextResponse.json({ message: "Code parameter is required" }, { status: 400 });
  }

  try {
    const existingBook = await prisma.book.findUnique({
      where: { code },
    });

    if (!existingBook) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    await prisma.book.delete({
      where: { code },
    });

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error deleting book" }, { status: 500 });
  }
}
