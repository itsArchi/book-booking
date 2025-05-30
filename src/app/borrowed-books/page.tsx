/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { motion } from 'framer-motion';

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
        if (response.data.message) {
          setErrorMessage(response.data.message); 
        } else {
          setBorrowedBooks(response.data); 
        }
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
    <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-5xl w-full space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-gray-800"
        >
          Borrowed Books
        </motion.h1>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center"
          >
            {errorMessage}
          </motion.div>
        )}

        {borrowedBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 text-lg"
          >
            You haven’t borrowed any books yet.
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {borrowedBooks.map((book) => (
              <motion.div
                key={book.code}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300"
              >
                <h3 className="text-2xl font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600 mt-1">By {book.author}</p>
                <div className="mt-4">
                  <button
                    onClick={() => handleReturnBook(book.code)}
                    className="w-full py-2 px-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                  >
                    Return Book
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooksPage;
