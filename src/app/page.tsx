'use client'

import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';  // Axios instance for API calls

interface Book {
  code: string;
  title: string;
  author: string;
  stock: number;
  isBorrowed: boolean;
}

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/book');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  const handleBorrowBook = async (bookCode: string) => {
    // Handle borrowing book logic (example)
    try {
      await axios.put(`/member/borrow`, { bookCode });
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.code === bookCode ? { ...book, isBorrowed: true } : book
        )
      );
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Available Books Root</h1>
      <div className="grid grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.code} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{book.title}</h3>
            <p>{book.author}</p>
            <p>Stock: {book.stock}</p>
            <p>{book.isBorrowed ? 'Not Available' : 'Available'}</p>
            <button
              onClick={() => handleBorrowBook(book.code)}
              disabled={book.isBorrowed}
              className="bg-blue-500 text-white p-2 mt-2 w-full"
            >
              {book.isBorrowed ? 'Already Borrowed' : 'Borrow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
