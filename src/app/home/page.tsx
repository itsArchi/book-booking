'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the stored member code and redirect to login page
    localStorage.removeItem('memberCode');
    router.push('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Welcome to the Booking App</h1>
        <p className="text-lg mb-4">Here you can borrow and return books</p>

        {/* Button to go to the book list */}
        <button
          onClick={() => router.push('/book')} // Navigate to the book borrowing page
          className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 w-full mb-4"
        >
          Go to Book List
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout} // Logout and redirect to the login page
          className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition duration-300 w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
