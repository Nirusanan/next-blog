'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


const PAGE_SIZE = 3; // Number of items per page

function Pagination({ data }) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / PAGE_SIZE);

    // Calculate start and end index for the current page
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, data.length);

    // Get the data for the current page
    const currentPageData = data.slice(startIndex, endIndex);

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPageData.map((item, index) => (
                    <Link href={"/post/" + item._id}>
                        <div className="border border-gray-200 p-4">
                            <Image src={`/uploads/${item.filePath}`} alt="DPO" width={240} height={240} className="w-full mb-4"/>
                            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                            <p className="text-gray-600">{item.short_description}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center mt-4 mb-4">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="mr-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`mr-2 px-3 py-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            } rounded`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                    Next
                </button>
            </div>

        </>

    );
}

export default Pagination;
