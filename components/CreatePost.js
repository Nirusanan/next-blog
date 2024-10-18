'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { marked } from 'marked';
import MarkdownRenderer from '../components/MarkdownRenderer';


export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [isTextareaVisible, setIsTextareaVisible] = useState(true); 

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (session) {
      console.log(session.user.id);
      setUserId(session.user.id);
    } else {
      router.push('/login');
    }
  }, [session, status, router]);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      fileInputRef.current.value = '';
      console.log('Only image files are allowed');
      setError('Only image files are allowed');
      setTimeout(() => {
        setError('')
      }, 2000)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a valid image file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('userId', userId);
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userPost`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Success:', data);
      router.push('/userPost/view');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while uploading the file.');
    }

    setTitle('');
    setDescription('');
    setFile(null);
    setError('');
    fileInputRef.current.value = '';
  };

  const generateLLM = async (e) => {
    e.preventDefault();
   

    if (title) {
      setIsTextareaVisible(false);
      try {
        const res = await fetch('/api/groqLLM', {
          method: 'POST',
          body: JSON.stringify({ title }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch content');
        }

        const data = await res.json();
        setDescription(data.content);
        setError('');
      } catch (err) {
        setError(err.message);
        setTimeout(() => {
          setError("")
        }, 2000);
        setDescription('');
      }
    } else {
      setError('First enter the title');
      setTimeout(() => {
        setError("")
      }, 2000)
    }
  };

  const writeContent = async (e) => {
    e.preventDefault();
    setIsTextareaVisible(true);
    setDescription("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-cover bg-center px-4 py-8 sm:px-6 md:px-8" style={{ backgroundImage: "url('/img/background.jpg')" }}>
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white shadow-lg rounded-lg p-6 sm:p-8">
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-600">Create Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center space-x-8  my-4">
              <label htmlFor="content" className="text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Content
              </label>
              <button onClick={writeContent} className="bg-blue-500 text-white text-sm sm:text-base py-2 px-4 rounded hover:bg-blue-700">
                Write Content
              </button>
              <button onClick={generateLLM} className="bg-blue-500 text-white text-sm sm:text-base py-2 px-4 rounded hover:bg-blue-700">
                Generate LLM Content
              </button>
            </div>

            {isTextareaVisible && (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 sm:h-48 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            )}

            {!isTextareaVisible && (
              <div
                className="mt-4 p-4 border border-gray-300 rounded-lg overflow-auto"
                style={{
                  height: '200px',
                  maxHeight: '300px',
                  overflowY: 'scroll',
                  overflowX: 'auto',
                }}
              >
                <MarkdownRenderer content={description} />
              </div>
            )}

            <p className="text-blue-600 font-medium mb-2 text-sm sm:text-base">Markdown and LaTeX are available</p>

          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none"
              required
              ref={fileInputRef}
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Create Post
          </button>
        </form>
      </div >
    </div >
  );
}

