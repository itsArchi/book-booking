'use client';
import React, { ReactNode, useEffect } from 'react';
import { useUserStore } from './../store/userStore';
import { useRouter } from 'next/navigation'; 
import './globals.css';

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useUserStore(); 
  const router = useRouter(); 

  useEffect(() => {
    const memberCode = localStorage.getItem('memberCode'); 

    if (!memberCode) {
      router.push('/login');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`/api/member?code=${memberCode}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          router.push('/login'); 
          return;
        }

        const data = await response.json();
        console.log('Fetched user data:', data);

        if (data && data.name) {
          setUser(data.name); 
        }
      } catch (error) {
        console.error("Error fetching user information", error);
        router.push('/login'); 
      }
    };

    fetchUserInfo();  
  }, [setUser, router]);

  const handleLogout = () => {
    setUser(''); 
    localStorage.removeItem('memberCode'); 
    router.push('/home'); 
  };

  console.log('Current user:', user);

  return (
    <html lang="en">
      <body className="bg-gray-50 h-screen flex flex-col">
        <div className="app-container w-full flex flex-col flex-1">
          <header className="bg-blue-500 text-white p-4 shadow-lg flex justify-between items-center">
            <h1 className="text-xl font-bold">Booking App</h1>
            <nav className="flex items-center">
              <a href="/" className="text-white hover:underline mr-4">Home</a>
              <a href="/book" className="text-white hover:underline mr-4">Books</a>
              <a href="/borrowed-books" className="text-white hover:underline">Borrowed Books</a>
              <span className="ml-4 text-white">{`Hello, ${user || 'Guest'}`}</span> 
              {user && (
                <button
                  onClick={handleLogout}
                  className="ml-4 text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Logout
                </button>
              )}
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
