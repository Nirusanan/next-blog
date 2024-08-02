'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Plus, Eye } from 'lucide-react';

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session) {
      const userId = session.user.id;
      fetchPosts(userId);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);

  const fetchPosts = async (userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userPost/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const result = await response.json();
      setPosts(result);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userPost/delete/${postId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete post');
        }

        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">My Blog Posts</h1>
          <Link href="/userPost/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg transition duration-300 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create Post</span>
            </motion.button>
          </Link>
        </div>
        
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={`/uploads/${post.filePath}`}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                  <p className="text-sm text-gray-400 mb-4">{post.created_at_formatted}</p>
                  <div className="flex justify-end space-x-2">
                    <Link href={`/post/${post.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-md transition duration-300"
                      >
                        <Eye size={20} />
                      </motion.button>
                    </Link>
                    <Link href={`/userPost/edit/${post.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-md transition duration-300"
                      >
                        <Edit2 size={20} />
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(post.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition duration-300"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500 mt-16"
          >
            <p className="text-2xl font-light">You haven't posted anything yet.</p>
            <p className="mt-2">Create your first post to get started!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AuthorPosts;