'use client'
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <Link href="/"> <h1 className="text-2xl">Blog</h1> </Link>
            <nav className="space-x-4">
                <Link href="/" className="text-blue-500">Home</Link>
                <Link href="/contact" className="text-blue-500">Contact</Link>
                {session ? (
                    <>
                        <Link href="/userPost" className="text-blue-500">Post</Link>
                        <button onClick={() => signOut()} className="text-blue-500">Logout</button>
                    </>
                ) : (
                    <Link href="/login" className="text-blue-500">Login</Link>
                )}
            </nav>
        </div>
    </header>

}
