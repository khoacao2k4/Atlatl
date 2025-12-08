import { NextRequest, NextResponse } from "next/server";
import { createResource } from '@/lib/actions/resources';
import mammoth from "mammoth"; 
import { extractText } from "unpdf"; 

export const runtime = "nodejs"; // ensure Node for file parsing

export async function POST(req: NextRequest) {
  try {
    console.log("POST called");
    const contentType = req.headers.get("content-type") || ""; 
    console.log("POST called 2");
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const text: string = body.text;
      const name: string = body.name; 
      const result = await createResource({ name: name, content: text });
      return NextResponse.json({ success: true, result });
    }

    else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      const name_req = formData.get("name") as string | null;

      if (!name_req) {
        return NextResponse.json({ error: "Missing name" }, { status: 400 });
      }

      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { error: "No file uploaded" },
          { status: 400 }
        );
      }

      // Convert file to Buffer for mammoth
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mime = file.type; // e.g. "application/pdf" or docx mimetype
      const name = file.name?.toLowerCase?.() || "";

      // const result = await mammoth.extractRawText({ buffer });
      let kind: "pdf" | "docx" | "unknown" = "unknown";
      let text = "";

      if (
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        name.endsWith(".docx")
      ) {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value || "";
        kind = "docx";
      }
      // ---- PDF ----
      else if (mime === "application/pdf" || name.endsWith(".pdf")) {
        console.log(name); 
        const { text: pdfText } = await extractText(arrayBuffer, {mergePages: true}); 
        text = (pdfText as string) || ""; 
        // console.log("POST called 3");
        // const result = await PDFParse(buffer);
        // // pdf-parse returns { text, numpages, info, metadata, ... }
        // console.log("POST called 4");
        // text = result.text || "";
        // kind = "pdf";
      } else {
        return NextResponse.json(
          { error: "Unsupported file type (only .docx and .pdf allowed)" },
          { status: 400 }
        );
      }

      console.log(text); 

      const dbResult = await createResource({ name: name_req, content: text });
      return NextResponse.json({ success: true, text });      
    }


  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}