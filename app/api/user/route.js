import connectMongo from "@/db/connectMongo";
import userModel from "@/models/userModel";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        const user = { name, email, password };
        await connectMongo();
        await userModel.create(user);
        return Response.json({ message: 'User has been registered' });
    } catch (error) {
        return Response.json({ message: error._message });
    }

}