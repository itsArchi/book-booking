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
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Borrowed Books</h1>
      {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

      {borrowedBooks.length === 0 ? (
        <div className="text-center text-gray-600">You havent borrowed any books.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowedBooks.map((book) => (
            <div key={book.code} className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold text-xl">{book.title}</h3>
              <p>{book.author}</p>
              <button
                onClick={() => handleReturnBook(book.code)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BorrowedBooksPage;
