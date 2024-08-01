'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();


  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session) {
      const userId = session.user.id;
      async function getData(userId) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userPost/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          const result = await response.json();
          setPosts(result);
          console.log(result);
        } catch (error) {
          console.error(error.message);
        }
      }
      getData(userId);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);
  
  return (
    <div className="container mx-auto p-4 py-6 bg-blue-100 min-h-screen">
      <div className="flex justify-end mb-6">
        <Link href="/userPost/create">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300">
            Create Post
          </button>
        </Link>
      </div>
      <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">My Blog Posts</h2>
      <div className="space-y-6">
        {posts && posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="p-6 bg-white shadow-lg rounded-md border border-gray-200 flex flex-col md:flex-row md:justify-center">
              <div className="w-full md:w-1/3 m-1">
                <Image src={`/uploads/${post.filePath}`} alt={post.title} className="w-full h-full object-fit rounded-md" width={400} height={240} />
              </div>
              <div className="w-full md:w-2/3 pl-6 md:pl-0 md:mt-0 mt-4">
                <h3 className="text-2xl font-bold text-gray-800">{post.title}</h3>
                <p className="mt-2 text-justify whitespace-pre-line text-gray-600">{post.description}</p>
                <p className="mt-4 text-gray-400 text-sm">Posted on: {post.created_at_formatted}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p>You have not posted anything yet.</p>
          </div>
        )}
      </div>
    </div>
  );

};

export default AuthorPosts;
