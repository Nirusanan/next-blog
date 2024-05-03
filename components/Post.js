import React from 'react'

async function getData({ params }) {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/post/${params.id}`)

    const json = await response.json()

    return json
}

export default async function page({ params }) {
    const post = await getData({ params });
    
    return (
        <>
            {post && <main className="container mx-auto px-4 py-6">
                <h2 className="text-center text-4xl font-bold mb-4">{post.title}</h2>
                <div className="flex justify-center items-center">
                    <img src={post.image} alt="Post Image" className="object-fit w-100 h-60 my-4" />
                </div>
                <p className="mx-4">{post.description}</p>
                <p className="text-right text-gray-500">{post.created_at_formatted}</p>
            </main>
            }
        </>
    )
}
