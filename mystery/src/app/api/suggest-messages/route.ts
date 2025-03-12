import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Your specific prompt
const QUESTIONS_PROMPT = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment`;

// Define an interface for our error response
interface GeminiErrorResponse {
  name: string;
  message: string;
  type: string;
  param: string | null;
  code: string | null;
  status: number;
}

export async function POST(req: Request) {
  try {
    // Generate questions using the predefined prompt
    const result = await model.generateContent(QUESTIONS_PROMPT);
    const response = result.response;
    const text = response.text();
    
    return NextResponse.json({ questions: text });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      console.error("Full Error:", error);

      // Detailed error handling similar to OpenAI's APIError
      const errorResponse: GeminiErrorResponse = {
        name: error.name,
        message: error.message,
        type: 'gemini_error',
        param: null,
        code: null,
        status: 500
      };

      // Check if it's a common Gemini error pattern
      if ('statusCode' in (error as any)) {
        errorResponse.status = (error as any).statusCode;
      }
      
      if ('details' in (error as any)) {
        errorResponse.param = (error as any).details;
      }
      
      // Extract error code if available
      if (error.message.includes('RESOURCE_EXHAUSTED')) {
        errorResponse.code = 'resource_exhausted';
      } else if (error.message.includes('INVALID_ARGUMENT')) {
        errorResponse.code = 'invalid_argument';
      } else if (error.message.includes('PERMISSION_DENIED')) {
        errorResponse.code = 'permission_denied';
      } else if (error.message.includes('UNAUTHENTICATED')) {
        errorResponse.code = 'unauthenticated';
      }

      return NextResponse.json(errorResponse, { status: errorResponse.status });
    } else {
      console.error("Check gemini-questions file!");
      
      const unknownErrorResponse: GeminiErrorResponse = {
        name: 'UnknownError',
        message: 'An unknown error occurred',
        type: 'gemini_error',
        code: 'unknown_error',
        param: null,
        status: 500
      };
      
      return NextResponse.json(unknownErrorResponse, { status: 500 });
    }
  }
}