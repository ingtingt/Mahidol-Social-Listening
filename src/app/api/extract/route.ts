import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const SYSTEM_PROMPT = `You are an AI assistant specialized in text analysis. Your task is to extract the most relevant main keywords and sub-keywords from the given text. Respond *only* in JSON format. The JSON must have two keys: "mainKeywords" and "subKeywords". The value for each key should be an array of strings.

Example:
{
  "mainKeywords": ["Mahidol University", "Admission"],
  "subKeywords": ["Salaya campus", "application requirements"]
}`;

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      // --- THIS IS THE FIX ---
      model: 'gemini-2.5-flash', // Use the stable 'gemini-pro' model
      // ----------------------
      generationConfig: {
        responseMimeType: 'application/json',
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(text);
    const aiResponse = result.response;

    if (!aiResponse || !aiResponse.text) {
      throw new Error('AI returned an empty response.');
    }

    return NextResponse.json(JSON.parse(aiResponse.text()));
  } catch (error) {
    console.error('Failed to extract keywords:', error);
    // Send the specific error message to the front end for better debugging
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
