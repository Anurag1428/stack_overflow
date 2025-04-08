// app/api/ai/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Use named export for POST method (not default export)
export async function POST(request: Request) {
    try {
        const { question, model } = await request.json();

        if (!question) {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 });
        }

        // Use Gemini AI
        if (model === 'gemini') {
            // Initialize the Gemini API
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
            const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            
            // Generate content with Gemini
            const result = await geminiModel.generateContent(question);
            const response = await result.response;
            const reply = response.text();
            
            return NextResponse.json({ reply });
        } 
        // Use OpenAI (default)
        else {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a knowledgeable assistant that provides quality information.'
                        }, {
                            role: 'user',
                            content: `Tell me ${question}`
                        }
                    ]
                })
            });

            const responseData = await response.json();
            const reply = responseData.choices[0].message.content;

            return NextResponse.json({ reply });
        }
    } catch (error: any) {
        console.error('AI generation error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate content' }, { status: 500 });
    }
}