import { NextResponse } from "next/server";
import PostModel from '@/models/postModel';
import connectMongo from "@/db/connectMongo";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    console.log("Received form data:", formData);

    const title = formData.get("title");
    const description = formData.get("description");
    const userId = formData.get("userId");
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "File is required." },
        { status: 400 }
      );
    }

    const fileUrl = await uploadToCloudinary(file);

    await connectMongo();

    const newPost = new PostModel({
      title,
      description,
      filePath: fileUrl,
      userId,
    });
    
    const savedPost = await newPost.save();
    console.log("Post saved successfully:", savedPost);

    return NextResponse.json({ fileUrl: fileUrl });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Something went wrong.", details: error.message },
      { status: 500 }
    );
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
