/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

interface Book {
  code: string;
  title: string;
  author: string;
  isBorrowed: boolean;
}

const BorrowedBooksPage = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      const memberCode = localStorage.getItem('memberCode');
      if (!memberCode) {
        setErrorMessage('Please login first');
        return;
      }

      try {
        const response = await axios.get(`/member/borrowed?memberCode=${memberCode}`);
        setBorrowedBooks(response.data);
      } catch (error) {
        setErrorMessage('Failed to fetch borrowed books');
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleReturnBook = async (bookCode: string) => {
    try {
      const response = await axios.put(`/member/return`, { bookCode });
      if (response.status === 200) {
        setBorrowedBooks((prevBooks) => prevBooks.filter((book) => book.code !== bookCode));
      }
    } catch (error) {
      setErrorMessage('Error returning book');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex items-center justify-center">
      <div className="max-w-6xl w-full space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-white tracking-tight">
          Borrowed Books
        </h1>

        {errorMessage && <div className="text-red-400 text-center mb-4">{errorMessage}</div>}

        {borrowedBooks.length === 0 ? (
          <div className="text-center text-white text-lg">
            You havent borrowed any books yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {borrowedBooks.map((book) => (
              <div
                key={book.code}
                className="bg-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h3 className="font-semibold text-2xl text-gray-800">{book.title}</h3>
                <p className="text-gray-600 mt-2">{book.author}</p>
                <div className="mt-4">
                  <button
                    onClick={() => handleReturnBook(book.code)}
                    className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Return Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooksPage;
