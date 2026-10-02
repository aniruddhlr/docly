import { GoogleGenerativeAI } from '@google/generative-ai';

export interface QARequest {
  question: string;
  contextChunks: { text: string; citation?: string }[];
  documentTitle: string;
  apiKey: string;
}

export interface QAResponse {
  answer: string;
  citation?: string;
}

export async function answerDocumentQuestion(
  params: QARequest
): Promise<QAResponse> {
  const genAI = new GoogleGenerativeAI(params.apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: `
You are Docly AI Assistant. You answer questions strictly and accurately based on the provided document excerpts.
Keep your answers conversational, concise (1-2 sentences), clear, and friendly.
Always cite the source section or page if available.
If the information is not present in the excerpts, clearly and politely state that the document does not mention it.
    `,
  });

  const formattedContext = params.contextChunks
    .map((c, i) => `[Excerpt ${i + 1} - ${c.citation || 'General'}]:\n${c.text}`)
    .join('\n\n---\n\n');

  const prompt = `
Document Title: ${params.documentTitle}

Document Excerpts:
${formattedContext}

User Question: ${params.question}

Answer the question directly and concisely:
  `;

  const result = await model.generateContent(prompt);
  const answer = result.response.text();

  // Primary citation from top chunk
  const topCitation = params.contextChunks[0]?.citation || undefined;

  return {
    answer: answer.trim(),
    citation: topCitation,
  };
}
