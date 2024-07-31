import connectMongo from "@/db/connectMongo";
import PostModel from "@/models/postModel";




export async function GET(req, {params}) {
    try {
        await connectMongo();
        const posts = await PostModel.find({userId: params.userId});
        console.log(posts)
        return Response.json(posts);
    }
    catch (error) {
        return Response.json({ message: error.message });

    }

}

