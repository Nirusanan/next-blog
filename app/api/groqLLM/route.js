import Groq from "groq-sdk";
import { NextResponse } from 'next/server';


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


async function getGroqChatCompletion({title}) {

  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `write 5 paragraphs about ${title}`,
      },
    ],
    model: "llama3-8b-8192",
  });
}



export async function POST(request) {
  try {
    const { title } = await request.json();
    const chatCompletion = await getGroqChatCompletion({title});
    console.log(chatCompletion.choices[0]?.message?.content || "");

    const content = chatCompletion.choices[0]?.message?.content || "";

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

