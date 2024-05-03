'use client'
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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
    <>
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-4xl font-bold mb-4">Large Language Models</h2>
        <p>These are latest articles. </p>
      </main>

      <div className="flex justify-end px-4">
        <input onKeyDown={searchPost} ref={inputRef} type="text" className="px-4 py-2 border border-gray-300 rounded-md" placeholder="Search..." />
        <button onClick={searchPost} disabled={search} className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4">{search? '...' : 'Search'}</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts && posts.map((post) => (
        <Link href={"/post/"+post._id}>
        <div className="border border-gray-200 p-4">
          <img className="object-fill w-full h-48 hover:object-scale-down mb-4" src={post.image} alt="Post Image" />
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600">{post.short_description}</p>
        </div>
        </Link>
        )
        )}

        {posts && !posts.length > 0 && inputRef.current.value && <p>No available posts for your searching: <b>{inputRef.current.value}</b></p>}
      </div>
    </>
  );
}
