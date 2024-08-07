'use client'
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Pagination from "@/components/Pagination";

export default function Home() {
  const [posts, setPosts] = useState();
  const inputRef = useRef("");
  const [search, setSearch] = useState(false);

  useEffect(() =>{
    fetch(process.env.NEXT_PUBLIC_API_URL + '/posts')
    .then((res) => res.json())
    .then(res => setPosts(res))
  }, []);

  const searchPost = (e) =>{
    if (e.type == 'keydown' && e.key !== 'Enter') {
      return;
    }
    setSearch(true);

    fetch(process.env.NEXT_PUBLIC_API_URL + '/posts?q=' + inputRef.current.value)
    .then((res) => res.json())
    .then(res => setPosts(res))
    .finally(() => setSearch(false))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 mb-0">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Welcome to the Articles Hub</h1>
        </div>
      </header>

      <div className="container mx-auto flex justify-end px-4 py-8">
        <input
          onKeyDown={searchPost}
          ref={inputRef}
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search..."
        />
        <button
          onClick={searchPost}
          disabled={search}
          className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4 shadow-md hover:bg-blue-600 transition duration-200"
        >
          {search ? '...' : 'Search'}
        </button>
      </div>

      <div className="container mx-auto px-4 py-4">
        {posts && posts.length > 0 && <Pagination data={posts} />}
        {posts && !posts.length > 0 && inputRef.current.value && (
          <p className="text-red-500 text-lg mt-4">
            No available posts for your search: <b>{inputRef.current.value}</b>
          </p>
        )}
      </div>
    </div>
  
  );
}
