export type DocumentCategory = 
  | 'Bills' 
  | 'Vehicle' 
  | 'Finance' 
  | 'Home' 
  | 'Insurance' 
  | 'Purchases' 
  | 'Other';

export type FileType = 'PDF' | 'IMG' | 'DOCX';

export type DocumentStatus = 'organized' | 'inbox' | 'archived';

export interface DocumentFact {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface DocumentQA {
  question: string;
  answer: string;
  citation: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  emoji: string;
  bgColor: string;
  category: DocumentCategory;
  subcategory?: string;
  path: string;
  fileType: FileType;
  fileName: string;
  driveFileId?: string;
  gdriveFolder: string;
  addedTime: string;
  date?: string;
  expiryDate?: string;
  expiryNotice?: string;
  confidence: number;
  tags: string[];
  facts: DocumentFact[];
  metadata: Record<string, string>;
  details: {
    company?: string;
    type?: string;
    category?: string;
    policyNo?: string;
    vehicleNo?: string;
    amount?: string;
    confidenceLabel?: string;
    [key: string]: string | undefined;
  };
  askQA?: DocumentQA[];
}

export interface InboxItem {
  id: string;
  title: string;
  emoji: string;
  bgColor: string;
  meta: string;
  confidence: number;
  suggestedCategory: DocumentCategory;
  reason: string;
  type: 'uncertain' | 'duplicate';
  duplicateOf?: string;
}

export interface ExpiryReminder {
  id: string;
  docId: string;
  title: string;
  emoji: string;
  expiryDate: string;
  pillText: string;
  status: 'warn' | 'ok' | 'danger';
}

export interface CategoryInfo {
  id: DocumentCategory;
  name: string;
  emoji: string;
  color: string;
  bg: string;
  borderColor: string;
  count: number;
}
