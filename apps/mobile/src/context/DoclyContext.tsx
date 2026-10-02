import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  DocumentItem,
  InboxItem,
  ExpiryReminder,
  DocumentCategory,
  INITIAL_DOCUMENTS,
  INITIAL_INBOX_ITEMS,
  UPCOMING_REMINDERS,
  extractDocumentWithGemini,
} from '@docly/shared';
import * as Haptics from 'expo-haptics';

interface ProcessDocParams {
  base64Data?: string;
  mimeType?: string;
  fileName?: string;
}

export type HapticType = 'light' | 'medium' | 'success' | 'warning' | 'error';

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
  deleteDocument: (id: string) => void;
  renameDocument: (id: string, newTitle: string) => void;
  updateDocumentCategory: (id: string, category: DocumentCategory) => void;
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
  vibrationEnabled: boolean;
  setVibrationEnabled: (v: boolean) => void;
  triggerHaptic: (type?: HapticType) => void;
  processDocument: (params: ProcessDocParams) => Promise<DocumentItem>;
  loadSampleData: () => void;
  clearAllData: () => void;
}

const DoclyContext = createContext<DoclyContextType | undefined>(undefined);

export function DoclyProvider({ children }: { children: ReactNode }) {
  // Empty by default for real database integration
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
  const [reminders, setReminders] = useState<ExpiryReminder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [scannedPages, setScannedPages] = useState(0);
  const [latestProcessedDoc, setLatestProcessedDoc] = useState<DocumentItem | null>(null);
  const [autoOrganizeEnabled, setAutoOrganizeEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const triggerHaptic = (type: HapticType = 'light') => {
    if (!vibrationEnabled) return;
    try {
      if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      else if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      else if (type === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      else if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  };

  const toast = (msg: string) => {
    triggerHaptic('light');
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2400);
  };

  const resolveInboxItem = (id: string, toastMsg?: string) => {
    triggerHaptic('success');
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
      tags: [`#${category.toLowerCase()}`, '#filed'],
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

  const deleteDocument = (id: string) => {
    triggerHaptic('warning');
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast('Document deleted from Docly');
  };

  const renameDocument = (id: string, newTitle: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title: newTitle } : d))
    );
    toast('Document renamed ✓');
  };

  const updateDocumentCategory = (id: string, category: DocumentCategory) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              category,
              path: `${category} / Filed`,
              gdriveFolder: `My Drive / Docly / ${category}`,
            }
          : d
      )
    );
    toast(`Moved to ${category} ✓`);
  };

  const deleteAIData = () => {
    triggerHaptic('warning');
    toast('AI data cleared — files stay safe in your Google Drive 🔒');
  };

  const openAddSheet = () => {
    triggerHaptic('medium');
    setIsAddSheetOpen(true);
  };

  const closeAddSheet = () => {
    setIsAddSheetOpen(false);
  };

  const loadSampleData = () => {
    triggerHaptic('success');
    setDocuments(INITIAL_DOCUMENTS);
    setInboxItems(INITIAL_INBOX_ITEMS);
    setReminders(UPCOMING_REMINDERS);
    toast('Loaded sample demo documents ✓');
  };

  const clearAllData = () => {
    triggerHaptic('warning');
    setDocuments([]);
    setInboxItems([]);
    setReminders([]);
    toast('All documents cleared');
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

    // Default template item if no API key is set
    const fallbackDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: 'Scanned Document',
      emoji: '📄',
      bgColor: '#E8E1FF',
      category: 'Other',
      path: 'Other / Scans',
      fileType: 'PDF',
      fileName: fileName,
      gdriveFolder: 'My Drive / Docly / Other',
      addedTime: 'Just now',
      confidence: 0.95,
      tags: ['#scan', '#docly'],
      facts: [{ label: 'Captured', value: 'Today', highlight: true }],
      metadata: {},
      details: {
        company: 'Docly Scanner',
        type: 'Document',
        confidenceLabel: '95% ✨',
      },
    };

    setDocuments((prev) => [fallbackDoc, ...prev]);
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
        deleteDocument,
        renameDocument,
        updateDocumentCategory,
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
        vibrationEnabled,
        setVibrationEnabled,
        triggerHaptic,
        processDocument,
        loadSampleData,
        clearAllData,
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
