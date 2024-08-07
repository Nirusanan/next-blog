'use client'
import { React, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import SkeletonLoader from '@/components/SkeletonLoader';


export default function Page({ params }) {
    const [postData, setPostData] = useState({
        post: null,
        likes: null,
        comments: [],
    });
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession();

    const fetchPostAndComments = useCallback(async (postId) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!postId) {
                throw new Error('No post ID provided');
            }
            console.log('Fetching post with ID:', postId);
            const postResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${postId}?_=${Date.now()}`);
            if (!postResponse.ok) {
                throw new Error(`Failed to fetch post data: ${postResponse.status}`);
            }
            const fetchedPost = await postResponse.json();
            console.log('Fetched post data:', fetchedPost);

            console.log('Fetching comments for post ID:', fetchedPost._id);
            const commentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${fetchedPost._id}`);
            if (!commentsResponse.ok) {
                throw new Error(`Failed to fetch comments: ${commentsResponse.status}`);
            }
            const fetchedComments = await commentsResponse.json();
            console.log('Fetched comments:', fetchedComments);

            setPostData({
                post: fetchedPost,
                likes: fetchedPost.likes,
                comments: fetchedComments,
            });
            console.log('PostData state updated');
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
            console.log('Loading state set to false');
        }
    }, []);

    useEffect(() => {
        console.log('Effect running. Params:', params);
        if (params && params.id) {
            fetchPostAndComments(params.id);
        }
    }, [params, fetchPostAndComments]);



    const handleLike = async () => {
        if (!postData.post) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: postData.post._id }),
            });

            if (!response.ok) {
                throw new Error('Failed to update likes');
            }

            const result = await response.json();
            setPostData(prevData => ({
                ...prevData,
                likes: result.likes
            }));
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!postData.post || !comment.trim()) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment: comment, userId: session?.user.id, postId: postData.post._id }),

            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }

            const newComment = await response.json();
            setPostData(prevData => ({
                ...prevData,
                comments: [...prevData.comments, newComment.comment]
            }));
            setComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    if (isLoading) return <SkeletonLoader />;
    if (error) return <p className="text-center text-2xl mt-8 text-red-500">Error: {error}</p>;
    if (!postData.post) return <p className="text-center text-2xl mt-8">No post found</p>;

    return (
        <main className="bg-cover bg-center min-h-screen" style={{ backgroundImage: "url('/img/background.jpg')" }}>
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16 w-full md:w-5/6 lg:w-3/4">
                <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 bg-opacity-90 backdrop-blur-sm">
                    <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800">{postData.post.title}</h2>
                    <div className="flex justify-center items-center">
                        <div className="w-full max-w-xl">
                            <Image
                                src={postData.post.filePath}
                                alt="Post Image"
                                className="object-cover w-full h-48 sm:h-60 md:h-80 my-4 rounded-lg"
                                width={400}
                                height={240}
                                layout="responsive"
                            />
                        </div>
                    </div>
                    <div className="my-4 sm:my-6 text-base sm:text-lg text-gray-700 leading-relaxed">
                        {postData.post.description.split('\n').map((text, index) => (
                            <p key={index} className={`mx-2 sm:mx-4 text-justify whitespace-pre-line ${index === 0 ? 'mt-0' : 'mt-2 sm:mt-4'}`}>{text}</p>
                        ))}
                    </div>
                    <p className="text-right text-sm sm:text-base text-gray-500">Author: {postData.post.userId.name}</p>
                    <p className="text-right text-sm sm:text-base text-gray-500">{postData.post.created_at_formatted}</p>
                    <div className="mt-4 sm:mt-8 flex items-center">
                        <button
                            onClick={handleLike}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                            disabled={!session}
                        >
                            <FontAwesomeIcon icon={faHeart} size="lg" className="sm:text-2xl" />
                        </button>
                        <span className="ml-2 text-base sm:text-lg">{postData.likes}</span>
                    </div>

                    {/* Comments section */}
                    <div className="mt-6 sm:mt-8">
                        <h3 className="text-xl sm:text-2xl font-bold mb-4">Comments</h3>
                        {session ? (
                            <>
                                <form onSubmit={handleCommentSubmit} className="mb-4">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg mb-2"
                                        placeholder="Add a comment"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-700 focus:outline-none"
                                    >
                                        Submit
                                    </button>
                                </form>
                                <div>
                                    {postData.comments.length > 0 ? (
                                        postData.comments.map((cmt, index) => (
                                            <div key={index} className="bg-gray-100 p-3 sm:p-4 rounded-lg mb-2 text-sm sm:text-base">
                                                {cmt.comment}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm sm:text-base">No comments yet. Be the first to comment!</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center p-4 sm:p-6 bg-yellow-100 border border-yellow-300 rounded-lg shadow-md">
                                <div className="flex-shrink-0">
                                    <FontAwesomeIcon icon={faUserLock} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                                </div>
                                <div className="ml-3 sm:ml-4">
                                    <p className="text-base sm:text-xl font-semibold text-gray-800">
                                        Please log in to view and add comments!
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                        Once you&apos;re logged in, you can join the discussion and share your thoughts.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}