import { embed, embedMany } from 'ai';
// import { ollama } from 'ollama-ai-provider-v2';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';
import { google } from '@ai-sdk/google';

// const embeddingModel = openai.embedding('text-embedding-ada-002');
// const embeddingModel = ollama.embedding('mxbai-embed-large'); 
const embeddingModel = google.textEmbedding("text-embedding-004");

const special_words = ["Ph.D.", "J.D."];
const MAX_TOKENS = 32;

const generateChunks = (input: string): string[] => {
  const words: string[] = input.trim().split(' ').filter(i => i !== '');
  const sentences: string[] = []
  for (let i: number = 0, start_index = 0; i < words.length; ) {
    let sentence: string = ""; 
    let end_index = i; 
    let flag = 0; 
    let count = 0; 
    while (count < MAX_TOKENS && end_index < words.length ) {
        sentence += words[end_index] + " "; 
        end_index += 1
        if (end_index == words.length) {
            break; 
        }
        if (words[end_index].indexOf(".") !== -1 && !(words[end_index] in special_words)) {
            start_index = end_index + 1; 
            flag = 1; 
        }
        count += 1; 
    }

    if (end_index < words.length) {
        sentence += words[end_index]; 
    }

    sentences.push(sentence); 
    if (flag != 0) {
        i = start_index; 
    }
    else {
        i = end_index + 1; 
    }
  }
  return sentences; 
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  console.log("generateEmbeddings go in"); 
  const chunks = generateChunks(value);
  console.log("generateEmbeddings generateChunks success"); 
  console.log(chunks); 
  try {
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunks,
    });
    console.log("generateEmbeddings embedMany success"); 
    console.log(
      embeddings[0]
    );
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
  }
  catch (err:any) {
    console.error("EmbedMany Error:", err);
    console.error("Error message:", err?.message);
    console.error("Cause:", err?.cause);
    console.error("Stack:", err?.stack);
    return []; 
  }
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  console.log("Query called");
  const userQueryEmbedded = await generateEmbedding(userQuery);
  console.log(userQueryEmbedded); 
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(5);
  console.log(similarGuides); 
  return similarGuides;
};