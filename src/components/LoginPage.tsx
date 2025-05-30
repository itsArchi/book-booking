'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [memberCode, setMemberCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (!memberCode) {
      setErrorMessage('Please enter a member code');
      return;
    }

    if (memberCode === 'M001' || memberCode === 'M002' || memberCode === 'M003') {
      localStorage.setItem('memberCode', memberCode);  
      setErrorMessage('');
      router.push('/home');  
    } else {
      setErrorMessage('Invalid member code');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-800">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Login</h2>

        {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

        <input
          type="text"
          placeholder="Enter your member code"
          className="w-full p-3 border-2 border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={memberCode}
          onChange={(e) => setMemberCode(e.target.value)}
        />

        <button
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          onClick={handleLogin}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
