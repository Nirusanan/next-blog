import connectMongo from "@/db/connectMongo";
import Comment from "@/models/Comment";



export async function GET(req, {params}) {
    try {
        await connectMongo();
        const comments = await Comment.find({postId: params.postId});
        console.log(comments)
        return Response.json(comments);
    }
    catch (error) {
        return Response.json({ message: error.message });

    }

}