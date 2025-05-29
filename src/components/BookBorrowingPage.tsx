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
        const response = await axios.get('/book'); 
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
      const memberCode = localStorage.getItem('memberCode');
      if (!memberCode) {
        setErrorMessage('Please log in first');
        return;
      }

      const response = await axios.put(`/member/borrow`, { memberCode, bookCode });

      if (response.status === 200) {
        setBooks(prevBooks =>
          prevBooks.map(book =>
            book.code === bookCode
              ? { ...book, isBorrowed: true, stock: book.stock - 1 }
              : book
          )
        );
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage('Error borrowing book');
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
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage('Error returning the book');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Available Books</h1>
        {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.code} className="bg-white p-4 rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl">
              <h3 className="font-semibold text-lg text-gray-800">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500 mt-2">Stock: {book.stock}</p>
              <p className="text-sm text-gray-500">{book.isBorrowed ? 'Not Available' : 'Available'}</p>

              <button
                onClick={() => handleBorrowBook(book.code)}
                disabled={book.isBorrowed}
                className={`w-full py-2 mt-4 rounded-md text-white ${book.isBorrowed ? 'bg-gray-500' : 'bg-blue-500'} hover:bg-blue-600 transition-all duration-300`}
              >
                {book.isBorrowed ? 'Already Borrowed' : 'Borrow'}
              </button>

              {book.isBorrowed && (
                <button
                  onClick={() => handleReturnBook(book.code)}
                  className="w-full py-2 mt-4 rounded-md text-white bg-red-500 hover:bg-red-600 transition-all duration-300"
                >
                  Return Book
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookBorrowingPage;
