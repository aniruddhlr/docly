import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { DOCUMENT_EXTRACTION_SYSTEM_PROMPT, ExtractedDocumentData } from './prompts';

export interface ExtractionParams {
  apiKey: string;
  base64Data: string; // base64 encoded document image or PDF
  mimeType: string;   // e.g. 'application/pdf', 'image/jpeg', 'image/png'
  originalFileName: string;
}

const DOCUMENT_RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING, description: 'Standardized clean document title' },
    emoji: { type: SchemaType.STRING, description: 'Single representative emoji (e.g. 🚗, 🧾, 🏦, 📄, 🏠)' },
    bgColor: { type: SchemaType.STRING, description: 'Hex background color for emoji (e.g. #D7EEFF, #FFE9B8, #D6F5E3, #FFE0D6, #E8E1FF)' },
    category: {
      type: SchemaType.STRING,
      enum: ['Bills', 'Vehicle', 'Finance', 'Home', 'Insurance', 'Purchases', 'Other'],
      description: 'Document category',
    },
    subcategory: { type: SchemaType.STRING, description: 'Subcategory label (e.g. Bank statement, Insurance, Utilities)' },
    path: { type: SchemaType.STRING, description: 'Full hierarchy path (e.g. Insurance / Vehicle)' },
    fileName: { type: SchemaType.STRING, description: 'Standardized descriptive filename with extension' },
    documentDate: { type: SchemaType.STRING, description: 'Date of document in readable format or YYYY-MM-DD' },
    expiryDate: { type: SchemaType.STRING, description: 'Expiry or renewal date if present (YYYY-MM-DD)' },
    expiryNotice: { type: SchemaType.STRING, description: 'Human friendly notice (e.g. Renews 23 Sep 2027)' },
    confidence: { type: SchemaType.NUMBER, description: 'Confidence score from 0.0 to 1.0' },
    confidenceReason: { type: SchemaType.STRING, description: 'Brief explanation of confidence' },
    tags: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: '3-6 search tags starting with #',
    },
    facts: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          label: { type: SchemaType.STRING },
          value: { type: SchemaType.STRING },
          highlight: { type: SchemaType.BOOLEAN },
        },
        required: ['label', 'value'],
      },
      description: 'Key summary facts',
    },
    details: {
      type: SchemaType.OBJECT,
      properties: {
        company: { type: SchemaType.STRING },
        type: { type: SchemaType.STRING },
        policyNo: { type: SchemaType.STRING },
        vehicleNo: { type: SchemaType.STRING },
        amount: { type: SchemaType.STRING },
      },
    },
    rawText: { type: SchemaType.STRING, description: 'Full extracted OCR text content' },
  },
  required: ['title', 'category', 'path', 'fileName', 'confidence', 'tags', 'facts', 'rawText'],
};

export async function extractDocumentWithGemini(
  params: ExtractionParams
): Promise<ExtractedDocumentData> {
  const genAI = new GoogleGenerativeAI(params.apiKey);
  
  // Use gemini-2.0-flash or gemini-1.5-flash
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: DOCUMENT_EXTRACTION_SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: DOCUMENT_RESPONSE_SCHEMA as any,
      temperature: 0.1,
    },
  });

  const part = {
    inlineData: {
      data: params.base64Data,
      mimeType: params.mimeType,
    },
  };

  const prompt = `Analyze this document file ("${params.originalFileName}") thoroughly. Extract all entities, text, dates, numbers, and calculate confidence.`;

  const result = await model.generateContent([prompt, part]);
  const responseText = result.response.text();
  
  const parsed: ExtractedDocumentData = JSON.parse(responseText);

  // Set friendly confidence label
  const pct = Math.round(parsed.confidence * 100);
  if (!parsed.details) {
    parsed.details = {};
  }
  parsed.details.confidenceLabel = `${pct}% ${pct >= 90 ? '✨' : '⚠️'}`;

  return parsed;
}
