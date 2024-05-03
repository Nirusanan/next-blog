import connectMongo from "@/db/connectMongo";
import contactModel from "@/models/contactModel";

export async function POST(req) {
    try {
        const { name, email, message } = await req.json();
        const contact = { name, email, message };
        await connectMongo();
        await contactModel.create(contact);
        return Response.json({ message: 'Info has been sent' });
    } catch (error) {
        return Response.json({ message: error._message });
    }

}