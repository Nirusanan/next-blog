'use client'
import { React, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faUserLock } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';


export default function page({ post }) {
    const [likes, setLikes] = useState(post.likes);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [userId, setUserId] = useState('');
    const isFetching = useRef(false);
    const isMounted = useRef(true);


    const { data: session } = useSession();

    const postId = post._id;
   
    useEffect(() => {
        let isMounted = true;
        if (session) {
            console.log(session.user.id);
            setUserId(session.user.id);
        }

        async function getData(postId) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${postId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const result = await response.json();
                console.log(result);

                const newComments = result.map(item => item.comment);
                console.log(newComments);
                if (isMounted) {
                    // Update state once
                    setComments(prevComments => [...prevComments, ...newComments]);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        getData(postId);

        return () => {
            isMounted = false;
        };
    }, [session, postId]);




    const handleLike = async () => {
        if (isFetching.current) return; // If a request is already in progress, exit early
        isFetching.current = true; 
        setLikes(prevLikes => prevLikes + 1);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit likes');
            }

            const result = await response.json();
            console.log('Server updated likes:', result.likes);

            // Update the likes count with the server response if the component is still mounted
            if (isMounted.current) {
                setLikes(result.likes);
            }

        } catch (error) {
            console.error('Error submitting likes:', error);

            if (isMounted.current) {
                setLikes(prevLikes => prevLikes - 1);
            }
        } finally {
            isFetching.current = false;
        }
    };



    const handleCommentSubmit  = async (e) => {
        e.preventDefault();

        if (comment.trim()) {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
                method: 'POST',
                body: JSON.stringify({ comment: comment, userId: userId, postId: postId }),
              });
      
              if (!response.ok) {
                throw new Error('Failed to submit comment');
              }
      
              const result = await response.json();
              setComments([...comments, comment]);
              setComment('');
            } catch (error) {
              console.error('Error submitting comment:', error);
            }
        }
    };


    const formattedDescription = post.description.split('\n').map((text, index) => (
        <p key={index} className="mx-4 text-justify whitespace-pre-line">{text}</p>
    ));

    return (
        <>
            {post && (
                <main className="bg-cover bg-center min-h-screen" style={{ backgroundImage: "url('/img/background.jpg')" }}>
                    <div className="container mx-auto px-16 py-16 w-3/4">
                        <div className="bg-white shadow-lg rounded-lg p-8 bg-opacity-90 backdrop-blur-sm">
                            <h2 className="text-center text-4xl font-bold mb-4 text-gray-800">{post.title}</h2>
                            <div className="flex justify-center items-center">
                                <div className="w-full max-w-xl">
                                    <Image src={`/uploads/${post.filePath}`} alt="Post Image" className="object-fit w-100 h-60 my-4" width={400} height={240} />
                                </div>
                            </div>
                            <div className="my-6 text-lg text-gray-700 leading-relaxed">
                                {formattedDescription}
                            </div>
                            <p className="text-right text-gray-500">Author: {post.userId.name}</p>
                            <p className="text-right text-gray-500">{post.created_at_formatted}</p>
                            <div className="mt-8 flex items-center">
                                <button
                                    onClick={handleLike}
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                    disabled={!session}
                                >
                                    <FontAwesomeIcon icon={faHeart} size="2x" />
                                </button>
                                <span className="ml-2 text-lg">{likes}</span>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-2xl font-bold mb-4">Comments</h3>
                                <form onSubmit={handleCommentSubmit} className="mb-4">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg mb-2 ${!session ? 'bg-gray-300 opacity-70 text-white cursor-not-allowed' : ''}`}
                                        placeholder="Add a comment"
                                        disabled={!session}
                                    />
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none ${session ? '' : 'bg-gray-300 cursor-not-allowed'}`}
                                        disabled={!session}
                                    >
                                        Submit
                                    </button>
                                </form>
                                {session ? (
                                    <div>
                                        {comments.length > 0 ? (
                                            comments.map((cmt, index) => (
                                                <div key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
                                                    {cmt}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No comments yet. Be the first to comment!</p>
                                        )}
                                    </div>) : (
                                    <div className="flex items-center justify-center p-6 bg-yellow-100 border border-yellow-300 rounded-lg shadow-md">
                                        <div className="flex-shrink-0">
                                            <FontAwesomeIcon icon={faUserLock} className="w-6 h-6 text-yellow-500" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-xl font-semibold text-gray-800">
                                                Please log in to view and add comments!
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Once you're logged in, you can join the discussion and share your thoughts.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            )}

        </>
    )
}
