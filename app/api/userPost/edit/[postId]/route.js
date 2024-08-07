import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
// import { writeFile } from 'fs/promises';
// import mime from "mime";
// import { join } from "path";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
        const db = client.db('blog_mongodb'); 

        const formData = await request.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const file = formData.get('file');

        const updateData = {
            title,
            description,
        };

        if (file) {
            // const bytes = await file.arrayBuffer();
            // const buffer = Buffer.from(bytes);
            // const uploadDir = join(process.cwd(), "public", "uploads");

            // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            // const filename = `${file.name.replace(
            //     /\.[^/.]+$/,
            //     ""
            // )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

            // await writeFile(`${uploadDir}/${filename}`, buffer);

            const filename = await uploadToCloudinary(file);

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

async function uploadToCloudinary(file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
  
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: "auto",
        folder: "uploads", 
        public_id: `${Date.now()}-${file.name}` 
      };
  
      cloudinary.v2.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      ).end(buffer);
    });
  }