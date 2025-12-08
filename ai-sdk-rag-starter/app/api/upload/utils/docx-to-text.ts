import fs from "fs"; 
import mammoth from "mammoth"; 

export async function docxToText(filePath) {
  // Read the .docx into a buffer
  const buffer = fs.readFileSync(filePath);

  // Extract text
  const result = await mammoth.extractRawText({ buffer });
  return result.value; // the plain text
}