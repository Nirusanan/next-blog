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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundImage: "url('/img/login_background.jpg')" }}>
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-t-4 border-yellow-500 rounded-b text-yellow-900 px-4 py-3 mt-5 mx-auto w-full max-w-lg" role="alert">
          <div className="flex">
            <div>
              <p className="font-bold">Alert!</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl overflow-hidden">
        <div className="md:flex">
          <div className="hidden md:block md:w-1/2 p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-blue mb-2 lg:mb-4">Hey there!</h2>
            <h2 className="text-2xl lg:text-3xl font-bold text-blue mb-4">Welcome to Login</h2>
            <div className="relative w-full h-48 sm:h-64 md:h-80">
              <Image src="/img/login.jpg" alt="Illustration" layout="fill" objectFit="contain" />
            </div>
            <div className="mt-4 lg:mt-6 text-center text-blue text-sm lg:text-base">
              Don&apos;t have an account?
              <Link href="/register" className="text-blue-500 hover:underline"> Sign up here</Link>
            </div>
          </div>
          <div className="hidden md:block border-l border-gray-300"></div>
          <div className="w-full md:w-1/2 p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Sign In</h2>
            <button className="w-full bg-white text-black border border-gray-300 rounded-lg py-2 mb-3 sm:mb-4 flex items-center justify-center hover:bg-blue-500 hover:text-white transition duration-300 text-sm sm:text-base">
              <Image src="/img/google.png" alt="Google" width={16} height={16} className="mr-2" />
              Sign in with Google
            </button>
            <button className="w-full bg-white text-black border border-gray-300 rounded-lg py-2 mb-3 sm:mb-4 flex items-center justify-center hover:bg-blue-500 hover:text-white transition duration-300 text-sm sm:text-base">
              <Image src="/img/facebook.png" alt="Facebook" width={16} height={16} className="mr-2" />
              Sign in with Facebook
            </button>
            <div className="flex items-center my-3 sm:my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 sm:mx-4 text-gray-400 text-sm">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm sm:text-base">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm sm:text-base">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <Link href="#" className="text-xs sm:text-sm text-blue-500 hover:underline">Forgot password?</Link>
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                Sign in
              </button>
            </form>
            <div className="mt-4 text-center text-blue text-sm md:hidden">
              Don&apos;t have an account?
              <Link href="/register" className="text-blue-500 hover:underline"> Sign up here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
