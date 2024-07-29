import { NextResponse } from 'next/server';
import connectMongo from "@/db/connectMongo";
import Comment from '@/models/Comment';
import Post from '@/models/postModel';


export async function POST(req) {
  try {
    const { comment, postId, userId } = await req.json();

    await connectMongo();

    const newComment = new Comment({
      comment,
      postId,
      userId,
    });

    const savedComment = await newComment.save();
    // Add the comment reference to the post
    await Post.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } });
    return NextResponse.json({ message: 'Comment created successfully', comment: savedComment }, { status: 201 });

  } catch (error) {
    console.error("Error while trying to upload a file\n", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
  

  
}
