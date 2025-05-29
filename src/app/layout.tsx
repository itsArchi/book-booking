'use client';
import React, { ReactNode } from 'react';
import './globals.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-gray-50 h-screen flex flex-col">
        <div className="app-container w-full flex flex-col flex-1">
          <header className="bg-blue-500 text-white p-4 shadow-lg">
            <h1 className="text-xl font-bold">Booking App</h1>
            <nav>
              <a href="/" className="text-white hover:underline mr-4">Home</a>
              <a href="/book" className="text-white hover:underline mr-4">Books</a>
              <a href="/borrowed-books" className="text-white hover:underline">Borrowed Books</a>
            </nav>
          </header>

          <main className="flex-1 p-6">{children}</main>

          <footer className="bg-gray-800 text-white p-4 text-center">
            <p>© 2025 Booking App</p>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default Layout;
