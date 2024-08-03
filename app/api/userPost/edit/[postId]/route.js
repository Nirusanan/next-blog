import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { writeFile } from 'fs/promises';
import mime from "mime";
import { join } from "path";

const clientPromise = MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



export async function PUT(request, { params }) {

    const { postId } = params;
    console.log(postId);

    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('blog_mongodb'); // Replace with your actual database name

        const formData = await request.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const file = formData.get('file');

        const updateData = {
            title,
            description,
        };

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = join(process.cwd(), "public", "uploads");

            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const filename = `${file.name.replace(
                /\.[^/.]+$/,
                ""
            )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

            await writeFile(`${uploadDir}/${filename}`, buffer);

            updateData.filePath = filename;
        }

        const objectId = new ObjectId(postId);
        const result = await db.collection('posts').updateOne(
            { _id: objectId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
