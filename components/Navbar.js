'use client'
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <header className="bg-white shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/" legacyBehavior>
                        <a className="flex items-center">
                            <Image src="/img/Blog_logo.jpg" alt="AIMinds Logo" width={40} height={40} />
                            <h1 className="ml-3 text-2xl font-bold text-gray-800">AIMinds</h1>
                        </a>
                    </Link>
                </div>
                <nav className="space-x-6">
                    <Link href="/" className="text-blue-800 font-bold hover:text-blue-500 transition duration-300">
                        Home
                    </Link>
                    <Link href="/contact" className="text-blue-800 font-bold hover:text-blue-500 transition duration-300">
                        Contact
                    </Link>
                    {session ? (
                        <>
                            <Link href="/userPost" className="text-blue-800 font-bold hover:text-blue-500 transition duration-300">
                                Post
                            </Link>
                            <button onClick={() => signOut()} className="text-blue-800 font-bold hover:text-blue-500 transition duration-300">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="text-blue-800 font-bold hover:text-blue-500 transition duration-300">
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}
