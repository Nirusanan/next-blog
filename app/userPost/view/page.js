'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';


const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);

  const { data: session } = useSession();
  const userId = session.user.id;
  
  useEffect(() => {
    
    async function getData(userId) {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userPost/${userId}`);
          if (!response.ok) {
              throw new Error('Failed to fetch comments');
          }
          const result = await response.json();
          setPosts(result);
          console.log(result);
      } catch (error) {
          console.error(error.message);
      }
    }
    getData(userId);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-100 min-h-screen">
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
            <div key={post.id} className="p-6 bg-white shadow-lg rounded-md border border-gray-200 flex">
              <div className="w-1/3">
                <Image src={`/uploads/${post.filePath}`} alt={post.title} className="w-full h-full object-fit rounded-md" width={400} height={240} />
                {/* <img src={post.image} alt={post.title} className="w-full h-full object-cover rounded-md"/> */}
              </div>
              <div className="w-2/3 pl-6">
                <h3 className="text-2xl font-bold text-gray-800">{post.title}</h3>
                <p className="mt-2 text-justify text-gray-600">{post.description}</p>
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

  // return (
  //   <div className="container mx-auto px-4 py-6 bg-blue-100 min-h-screen">
  //     <div className="flex justify-end mb-6">
  //       <Link href="/userPost/create">
  //         <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300">
  //           Create Post
  //         </button>
  //       </Link>
  //     </div>
  //     <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">My Blog Posts</h2>
  //     <div className="space-y-6">
  //       {posts && posts.length > 0 ? (
  //         posts.map(post => (
  //           <div key={post.id} className="p-6 bg-white shadow-lg rounded-md border border-gray-200">
  //             <h3 className="text-2xl font-bold text-gray-800">{post.title}</h3>
  //             <p className="mt-2 text-justify whitespace-pre-line text-gray-600">{post.description}</p>
  //             <p className="mt-4 text-gray-400 text-sm">Posted on: {post.created_at_formatted}</p>
  //           </div>
  //         ))
  //       ) : (
  //         <div className="text-center text-gray-500 mt-10">
  //           <p>You have not posted anything yet.</p>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
};

export default AuthorPosts;
