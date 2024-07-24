'use client'
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function userPost() {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; 
    if (!session) router.push('/login'); 
  }, [session, status, router]);

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Post</h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input type="email" className="mt-1 p-2 border rounded w-full" placeholder="Enter your email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Textarea</label>
            <input type="password" className="mt-1 p-2 border rounded w-full" placeholder="Enter your password" />
          </div>
          <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-700">Submit</button>
        </form>
       
      </div>
    </div>
  );
}
