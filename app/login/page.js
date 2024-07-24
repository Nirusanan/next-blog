'use client'
import Link from 'next/link';
import React from 'react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setTimeout(() => {
        setError("")
      }, 2000)
    } else {
      window.location.href = '/';
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {error  && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-t-4 border-yellow-500 rounded-b text-yellow-900 px-4 py-3 mt-5 w-full max-w-lg" role="alert">
          <div className="flex">
            <div>
              <p className="font-bold">Alert!</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-700">Login</button>
        </form>
        <p className="mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
