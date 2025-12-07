import { createResource } from '@/lib/actions/resources';
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage, tool, stepCountIs } from 'ai';
import { ollama } from 'ollama-ai-provider-v2';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';
import { google } from "@ai-sdk/google"


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// 👇 CORS: handle preflight (OPTIONS) requests
export async function OPTIONS(req: Request) {
  const allowedOrigin = 'http://localhost:3000';

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `You are a helpful assistant. If the user greets you and make small talk, reply normally. Else, do the following: 
    Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      // addResource: tool({
      //   description: `add a resource to your knowledge base.
      //     If the user provides a random piece of knowledge unprompted, ask for confirmation from the user.
      //     If the query ends in a question mark, it is a question, thus this tool is banned.`,
      //   inputSchema: z.object({
      //     content: z
      //       .string()
      //       .describe('the content or resource to add to the knowledge base'),
      //   }),
      //   execute: async ({ content }) => {
      //     const result = await createResource({ content });
      //     console.log('[addResource] result:', result);
      //     return result; // still return so the model sees it too
      //   },
      // }),
      getInformation: tool({
        description: `If the user ask a question, get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  // 👇 Get the original streaming response
  const originalResponse = result.toUIMessageStreamResponse();

  // 👇 Add CORS headers to the streaming response
  const allowedOrigin = 'http://localhost:3000';
  const headers = new Headers(originalResponse.headers);
  headers.set('Access-Control-Allow-Origin', allowedOrigin);
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return new Response(originalResponse.body, {
    status: originalResponse.status,
    statusText: originalResponse.statusText,
    headers,
  });
}