import connectMongo from "@/db/connectMongo";
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';


const clientPromise = MongoClient.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function DELETE(request, { params }) {
  const { postId } = params;

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const client =  await clientPromise;
    const db = client.db();

    const objectId = new ObjectId(params.postId);
    console.log(objectId);
    const result = await db.collection('posts').deleteOne({ _id: objectId });

    await client.close();

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

