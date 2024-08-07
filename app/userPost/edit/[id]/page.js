'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function EditPost({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/post/${params.id}`);
          if (!response.ok) throw new Error('Failed to fetch post');
          const post = await response.json();
          setTitle(post.title);
          setContent(post.description);
          // setPreviewUrl(`/uploads/${post.filePath}`);
          setPreviewUrl(post.filePath);
          setLoading(false);
        } catch (err) {
          setError('Failed to load post. Please try again.');
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [status, router, params.id]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', content);
    if (file) formData.append('file', file);

    try {
      const response = await fetch(`/api/userPost/edit/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update post');

      router.push('/userPost/view');
    } catch (err) {
      setError('Failed to update post. Please try again.');
      setTimeout(() => {
        setError("")
      }, 2000)
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (loading) return <SkeletonLoader />;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-cover bg-center px-4 py-8 sm:px-6 md:px-8" style={{ backgroundImage: "url('/img/background.jpg')" }}>
      <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        {error && (
          <div className="bg-yellow-100 border-t-4 border-yellow-500 rounded-b text-yellow-900 px-4 py-3 mt-5 mx-auto w-full max-w-lg" role="alert">
            <div className="flex">
              <div>
                <p className="font-bold">Alert!</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-600">Edit Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 text-gray-700 font-semibold">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="6"
              className="w-full h-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>
          <div>
            <label htmlFor="file" className="block mb-2 text-gray-700 font-semibold">Image</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>
          {previewUrl && (
            <div className="mt-4">
              <Image src={previewUrl} alt="Preview" width={200} height={200} className="rounded" />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
