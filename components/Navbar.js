'use client'
import React, {useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-white shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" legacyBehavior>
                            <a className="flex items-center">
                                <Image src="/img/Blog_logo.jpg" alt="AIMinds Logo" width={40} height={40} />
                                <h1 className="ml-3 text-2xl font-bold text-gray-800">AIMinds</h1>
                            </a>
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-6">
                        <NavLinks session={session} />
                    </div>
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-blue-800">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <nav className="px-4 pt-2 pb-4 space-y-2">
                        <NavLinks session={session} mobile />
                    </nav>
                </div>
            )}
        </header>
    );
}

const NavLinks = ({ session, mobile }) => {
    const linkClass = `block ${mobile ? 'py-2' : ''} text-blue-800 font-bold hover:text-blue-500 transition duration-300`;

    return (
        <>
            <Link href="/" className={linkClass}>
                Home
            </Link>
            <Link href="/contact" className={linkClass}>
                Contact
            </Link>
            {session ? (
                <>
                    <Link href="/userPost/view" className={linkClass}>
                        Post
                    </Link>
                    <button onClick={() => signOut()} className={linkClass}>
                        Logout
                    </button>
                </>
            ) : (
                <Link href="/login" className={linkClass}>
                    Login
                </Link>
            )}
        </>
    );
};
