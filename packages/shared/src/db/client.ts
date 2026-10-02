import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DocumentItem, DocumentCategory, FileType, DocumentStatus } from '../types';

export interface DbDocument {
  id: string;
  user_id: string;
  title: string;
  emoji: string;
  bg_color: string;
  category: DocumentCategory;
  subcategory?: string;
  path: string;
  file_type: FileType;
  file_name: string;
  file_size?: number;
  file_hash?: string;
  drive_file_id?: string;
  drive_web_link?: string;
  gdrive_folder: string;
  status: DocumentStatus;
  confidence: number;
  document_date?: string;
  expiry_date?: string;
  expiry_notice?: string;
  tags: string[];
  facts: any[];
  metadata: Record<string, string>;
  details: Record<string, string>;
  raw_text?: string;
  created_at: string;
  updated_at: string;
}

export interface DbDocumentChunk {
  id: string;
  document_id: string;
  user_id: string;
  page_number: number;
  chunk_index: number;
  chunk_text: string;
  citation?: string;
  similarity?: number;
}

export function dbDocumentToItem(doc: DbDocument): DocumentItem {
  return {
    id: doc.id,
    title: doc.title,
    emoji: doc.emoji || '📄',
    bgColor: doc.bg_color || '#E8E1FF',
    category: doc.category,
    subcategory: doc.subcategory,
    path: doc.path,
    fileType: doc.file_type,
    fileName: doc.file_name,
    driveFileId: doc.drive_file_id,
    gdriveFolder: doc.gdrive_folder,
    addedTime: 'Recently',
    date: doc.document_date,
    expiryDate: doc.expiry_date,
    expiryNotice: doc.expiry_notice,
    confidence: doc.confidence,
    tags: doc.tags || [],
    facts: doc.facts || [],
    metadata: doc.metadata || {},
    details: doc.details || {},
  };
}

export function createDoclySupabaseClient(
  supabaseUrl: string,
  supabaseAnonKey: string
): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}
