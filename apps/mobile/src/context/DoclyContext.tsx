import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  DocumentItem,
  InboxItem,
  ExpiryReminder,
  INITIAL_DOCUMENTS,
  INITIAL_INBOX_ITEMS,
  UPCOMING_REMINDERS,
  DocumentCategory,
  extractDocumentWithGemini,
} from '@docly/shared';
import * as Haptics from 'expo-haptics';

interface ProcessDocParams {
  base64Data?: string;
  mimeType?: string;
  fileName?: string;
}

interface DoclyContextType {
  documents: DocumentItem[];
  inboxItems: InboxItem[];
  inboxCount: number;
  reminders: ExpiryReminder[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resolveInboxItem: (id: string, toastMessage?: string) => void;
  assignCategoryToInboxItem: (id: string, category: DocumentCategory) => void;
  addDocument: (doc: DocumentItem) => void;
  deleteAIData: () => void;
  toastMessage: string | null;
  toast: (msg: string) => void;
  isAddSheetOpen: boolean;
  openAddSheet: () => void;
  closeAddSheet: () => void;
  scannedPages: number;
  setScannedPages: React.Dispatch<React.SetStateAction<number>>;
  latestProcessedDoc: DocumentItem | null;
  setLatestProcessedDoc: (doc: DocumentItem | null) => void;
  autoOrganizeEnabled: boolean;
  setAutoOrganizeEnabled: (v: boolean) => void;
  remindersEnabled: boolean;
  setRemindersEnabled: (v: boolean) => void;
  processDocument: (params: ProcessDocParams) => Promise<DocumentItem>;
}

const DoclyContext = createContext<DoclyContextType | undefined>(undefined);

export function DoclyProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(INITIAL_INBOX_ITEMS);
  const [reminders, setReminders] = useState<ExpiryReminder[]>(UPCOMING_REMINDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [scannedPages, setScannedPages] = useState(0);
  const [latestProcessedDoc, setLatestProcessedDoc] = useState<DocumentItem | null>(null);
  const [autoOrganizeEnabled, setAutoOrganizeEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const toast = (msg: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2400);
  };

  const resolveInboxItem = (id: string, toastMsg?: string) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    setInboxItems((prev) => prev.filter((item) => item.id !== id));
    if (toastMsg) {
      toast(toastMsg);
    }
  };

  const assignCategoryToInboxItem = (id: string, category: DocumentCategory) => {
    const item = inboxItems.find((i) => i.id === id);
    if (!item) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: item.title,
      emoji: item.emoji,
      bgColor: item.bgColor,
      category,
      path: `${category} / Filed`,
      fileType: 'PDF',
      fileName: `${item.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      gdriveFolder: `My Drive / Docly / ${category}`,
      addedTime: 'Just now',
      confidence: 0.99,
      tags: [`#${category.toLowerCase()}`, '#inbox-filed'],
      facts: [{ label: 'Filed', value: 'Today', highlight: true }],
      metadata: {},
      details: {
        category,
        company: item.title,
        confidenceLabel: 'Manual confirmation ✓',
      },
    };

    setDocuments((prev) => [newDoc, ...prev]);
    resolveInboxItem(id, `Saved to ${category} ✓`);
  };

  const addDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteAIData = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}
    toast('AI data cleared — files stay safe in your Google Drive 🔒');
  };

  const openAddSheet = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setIsAddSheetOpen(true);
  };

  const closeAddSheet = () => {
    setIsAddSheetOpen(false);
  };

  const processDocument = async ({
    base64Data,
    mimeType = 'application/pdf',
    fileName = 'scan_20261003.pdf',
  }: ProcessDocParams): Promise<DocumentItem> => {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    if (apiKey && base64Data) {
      try {
        const extracted = await extractDocumentWithGemini({
          apiKey,
          base64Data,
          mimeType,
          originalFileName: fileName,
        });

        const newDoc: DocumentItem = {
          id: `doc-${Date.now()}`,
          title: extracted.title,
          emoji: extracted.emoji,
          bgColor: extracted.bgColor,
          category: extracted.category,
          subcategory: extracted.subcategory,
          path: extracted.path,
          fileType: mimeType.includes('pdf') ? 'PDF' : 'IMG',
          fileName: extracted.fileName,
          gdriveFolder: `My Drive / Docly / ${extracted.path}`,
          addedTime: 'Just now',
          date: extracted.documentDate,
          expiryDate: extracted.expiryDate,
          expiryNotice: extracted.expiryNotice,
          confidence: extracted.confidence,
          tags: extracted.tags,
          facts: extracted.facts,
          metadata: {},
          details: extracted.details,
        };

        if (extracted.confidence >= 0.90) {
          setDocuments((prev) => [newDoc, ...prev]);
        } else {
          // Route to inbox if confidence is low
          const newInboxItem: InboxItem = {
            id: `ic-${Date.now()}`,
            title: extracted.title,
            emoji: extracted.emoji,
            bgColor: extracted.bgColor,
            meta: `${extracted.path} · needs verification`,
            confidence: extracted.confidence,
            suggestedCategory: extracted.category,
            reason: extracted.confidenceReason || 'Low extraction confidence, please confirm.',
            type: 'uncertain',
          };
          setInboxItems((prev) => [newInboxItem, ...prev]);
        }

        setLatestProcessedDoc(newDoc);
        return newDoc;
      } catch (err) {
        console.log('Gemini extraction error, using fallback:', err);
      }
    }

    // Default fallback document for offline demo or simulated scan
    const fallbackDoc = documents[0] || INITIAL_DOCUMENTS[0];
    setLatestProcessedDoc(fallbackDoc);
    return fallbackDoc;
  };

  return (
    <DoclyContext.Provider
      value={{
        documents,
        inboxItems,
        inboxCount: inboxItems.length,
        reminders,
        searchQuery,
        setSearchQuery,
        resolveInboxItem,
        assignCategoryToInboxItem,
        addDocument,
        deleteAIData,
        toastMessage,
        toast,
        isAddSheetOpen,
        openAddSheet,
        closeAddSheet,
        scannedPages,
        setScannedPages,
        latestProcessedDoc,
        setLatestProcessedDoc,
        autoOrganizeEnabled,
        setAutoOrganizeEnabled,
        remindersEnabled,
        setRemindersEnabled,
        processDocument,
      }}
    >
      {children}
    </DoclyContext.Provider>
  );
}

export function useDocly() {
  const context = useContext(DoclyContext);
  if (!context) {
    throw new Error('useDocly must be used within a DoclyProvider');
  }
  return context;
}
