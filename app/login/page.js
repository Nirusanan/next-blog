'use client'
import Link from 'next/link';
import React from 'react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      console.error('Login error:', res.error);
      setError(res.error);
      setTimeout(() => {
        setError("")
      }, 2000)
    } else {
      console.log('Login successful');
      router.push('/userPost/view');
      // window.location.href = '/userPost/view';
    }
  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundImage: "url('/img/login_background.jpg')" }}>
      {error && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-t-4 border-yellow-500 rounded-b text-yellow-900 px-4 py-3 mt-5 w-full max-w-lg" role="alert">
          <div className="flex">
            <div>
              <p className="font-bold">Alert!</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
        <div className="md:flex">
          <div className="hidden md:block w-1/2 p-8">
            <h2 className="text-3xl font-bold text-blue mb-4">Hey there!</h2>
            <h2 className="text-3xl font-bold text-blue mb-4">Welcome to Login</h2>
            <Image src="/img/login.jpg" alt="Illustration" width={380} height={380} className="w-full" />
            <div className="mt-6 text-center text-blue">
            Don&apos;t have an account?
            <Link href="/register" legacyBehavior><a className="text-blue-500 hover:underline">Sign up here</a></Link>
            </div>
          </div>
          <div className="border-l border-gray-300"></div>
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6">Sign In</h2>
            <button className="w-full bg-white text-black border border-gray-300 rounded-lg py-2 mb-4 flex items-center justify-center hover:bg-blue-500 hover:text-white transition duration-300">
              <Image src="/img/google.png" alt="Google" width={20} height={20} className="mr-2" />
              Sign in with Google
            </button>
            <button className="w-full bg-white text-black border border-gray-300 rounded-lg py-2 mb-4 flex items-center justify-center hover:bg-blue-500 hover:text-white transition duration-300">
              <Image src="/img/facebook.png" alt="Facebook" width={20} height={20} className="mr-2" />
              Sign in with Facebook
            </button>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-400">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <Link href="#" legacyBehavior><a className="text-sm text-blue-500 hover:underline">Forgot password?</a></Link>
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    
  );
}
