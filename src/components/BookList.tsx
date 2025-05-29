'use client';

import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useBookStore } from '../store/bookStore';
import { Book } from '@prisma/client';

const BookList = () => {
  const { books, setBooks, borrowBook, returnBook, borrowedBooks } = useBookStore();
  const [borrowedBookCode, setBorrowedBookCode] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchBooks = async (): Promise<void> => {
      try {
        const response = await axios.get('/book');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, [setBooks]);

  const handleBorrowBook = async (bookCode: string): Promise<void> => {
    if (!borrowedBookCode || !memberCode) {
      setErrorMessage('Please provide both member code and book code');
      return;
    }
  
    try {
      // Make sure the request URL is correct
      await axios.put('/member/borrow', { memberCode, bookCode });
      borrowBook(bookCode);  // Update the local store after successful borrowing
    } catch (error) {
      setErrorMessage('Failed to borrow the book');
      console.error('Error borrowing book:', error);
    }
  };
  

  const handleReturnBook = async (bookCode: string): Promise<void> => {
    try {
      await axios.delete(`/member?memberCode=${memberCode}&bookCode=${bookCode}`);
      returnBook(bookCode);
    } catch (error) {
      setErrorMessage('Failed to return the book');
      console.error('Error returning book:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <input
          type="text"
          placeholder="Enter member code"
          className="border p-2"
          value={memberCode}
          onChange={(e) => setMemberCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter book code"
          className="border p-2"
          value={borrowedBookCode}
          onChange={(e) => setBorrowedBookCode(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2"
          onClick={() => handleBorrowBook(borrowedBookCode)}
        >
          Borrow Book
        </button>
        <button
          className="bg-green-500 text-white p-2"
          onClick={() => handleReturnBook(borrowedBookCode)}
        >
          Return Book
        </button>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {books.map((book: Book) => (
          <div key={book.code} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{book.title}</h3>
            <p>{book.author}</p>
            <p>Stock: {book.stock}</p>
            <p>{borrowedBooks.has(book.code) ? 'Borrowed' : 'Available'}</p>
            <button
              onClick={() => handleBorrowBook(book.code)}
              disabled={borrowedBooks.has(book.code)}
              className="bg-blue-500 text-white p-2 mt-2 w-full"
            >
              {borrowedBooks.has(book.code) ? 'Already Borrowed' : 'Borrow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
