import { NextResponse } from 'next/server';
import connectMongo from "@/db/connectMongo";
import PostModel from "@/models/postModel";

export async function PUT(req) {
    try {
        await connectMongo();
        const { postId } = await req.json();

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { $inc: { likes: 1 } },
            { new: true } // return the updated document
        );

        if (!updatedPost) {
            return new Response(JSON.stringify({ message: "Post not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        console.log(updatedPost.likes); 
        return new Response(JSON.stringify(updatedPost), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error updating likes:', error);
        return NextResponse.json(
          { error: "Something went wrong." },
          { status: 500 }
        );
    }
}
