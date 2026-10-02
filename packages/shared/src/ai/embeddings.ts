import { GoogleGenerativeAI } from '@google/generative-ai';

export interface DocumentChunkInput {
  pageNumber: number;
  chunkIndex: number;
  text: string;
  citation: string;
}

export function chunkDocumentText(
  rawText: string,
  pageNumber: number = 1,
  chunkSize: number = 800,
  overlap: number = 150
): DocumentChunkInput[] {
  if (!rawText || !rawText.trim()) return [];

  const words = rawText.split(/\s+/);
  const chunks: DocumentChunkInput[] = [];
  let chunkIdx = 0;

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunkWords = words.slice(i, i + chunkSize);
    const text = chunkWords.join(' ');
    
    // Auto-detect section header if possible
    const firstLine = text.split('\n')[0].slice(0, 40);
    const citation = `Page ${pageNumber} · ${firstLine || 'Content'}`;

    chunks.push({
      pageNumber,
      chunkIndex: chunkIdx++,
      text,
      citation,
    });

    if (i + chunkSize >= words.length) break;
  }

  return chunks;
}

export async function generateGeminiEmbedding(
  text: string,
  apiKey: string
): Promise<number[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  const result = await model.embedContent(text);
  return result.embedding.values;
}
