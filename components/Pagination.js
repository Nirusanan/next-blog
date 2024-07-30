'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PAGE_SIZE = 6; // Number of items per page

function Pagination({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / PAGE_SIZE);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, data.length);

    const currentPageData = data.slice(startIndex, endIndex);

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPageData.map((item, index) => (
                    <Link href={`/post/${item._id}`} key={item._id} className="block">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                            <Image
                                src={`/uploads/${item.filePath}`}
                                alt={item.title}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
                                <p className="text-gray-600 text-sm">{item.short_description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
           
            <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={`px-3 py-2 border border-gray-300 text-sm font-medium ${
                                currentPage === i + 1
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default Pagination;
