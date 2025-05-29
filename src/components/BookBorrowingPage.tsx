/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';

interface Book {
  code: string;
  title: string;
  author: string;
  stock: number;
  isBorrowed: boolean;
}

const BookBorrowingPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/book');  // Get only available books
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        setErrorMessage('Error fetching books');
      }
    };
    fetchBooks();
  }, []);

  const handleBorrowBook = async (bookCode: string) => {
    try {
      const memberCode = localStorage.getItem("memberCode");
      if (!memberCode) {
        setErrorMessage('Please log in first');
        return;
      }
  
      const response = await axios.put(`/member/borrow`, { memberCode, bookCode });
      
      if (response.status === 200) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.code === bookCode ? { ...book, isBorrowed: true, stock: book.stock - 1 } : book
          )
        );
      }
    } catch (error) {
      setErrorMessage('Error borrowing book');
      console.error('Error borrowing book:', error);  // Log the error for debugging
    }
  };

  const handleReturnBook = async (bookCode: string) => {
    try {
      const response = await axios.put(`/member/return`, { bookCode });
      
      if (response.status === 200) {
        setBooks(prevBooks =>
          prevBooks.map(book =>
            book.code === bookCode
              ? { ...book, isBorrowed: false, stock: book.stock + 1 }
              : book
          )
        );
      } else {
        setErrorMessage(response.data.message);  // Show error message from the backend
      }
    } catch (error) {
      setErrorMessage('Error returning the book');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Available Books</h1>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
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
            {book.isBorrowed && (
              <button
                onClick={() => handleReturnBook(book.code)}
                className="bg-red-500 text-white p-2 mt-2 w-full"
              >
                Return Book
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookBorrowingPage;
