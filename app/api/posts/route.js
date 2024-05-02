import connectMongo from "../../../db/connectMongo";
import PostModel from "../../../models/postModel";


export async function GET() {
    try {
        await connectMongo();
        const postData = await PostModel.find({});
        return Response.json(postData);
    }
    catch (error) {
        return Response.json({ message: error.message });

    }

}