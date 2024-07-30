import connectMongo from "@/db/connectMongo";
import PostModel from "@/models/postModel";
import { NextResponse } from "next/server";
import userModel from "@/models/userModel";



export async function GET(req, {params}) {
    try {
        await connectMongo();
        // const post = await PostModel.findById(params.id);
        const post = await PostModel.findById(params.id).populate({
            path: 'userId',
            model: userModel,
            select: 'name',
          })
          .exec();
        console.log('Post likes:',post.likes); 
        
        return Response.json(post);
    }
    catch (error) {
        return Response.json({ message: error.message });

    }

}

