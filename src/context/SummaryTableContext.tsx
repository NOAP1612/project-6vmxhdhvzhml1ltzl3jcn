import { createContext, useState, useContext, ReactNode } from 'react';

export interface SummaryItem {
  concept: string;
  definition: string;
  explanation: string;
  example?: string;
}

export interface SummaryData {
  title: string;
  summary: SummaryItem[];
}

interface SummaryTableContextType {
  topic: string;
  setTopic: (topic: string) => void;
  sourceText: string;
  setSourceText: (text: string) => void;
  concepts: string[];
  setConcepts: (concepts: string[]) => void;
  language: string;
  setLanguage: (language: string) => void;
  fileName: string;
  setFileName: (name: string) => void;
  uploadProgress: string;
  setUploadProgress: (progress: string) => void;
  summaryData: SummaryData | null;
  setSummaryData: (data: SummaryData | null) => void;
}

const SummaryTableContext = createContext<SummaryTableContextType | undefined>(undefined);

export const SummaryTableProvider = ({ children }: { children: ReactNode }) => {
  const [topic, setTopic] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [concepts, setConcepts] = useState<string[]>(['']);
  const [language, setLanguage] = useState('hebrew');
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const value = {
    topic, setTopic,
    sourceText, setSourceText,
    concepts, setConcepts,
    language, setLanguage,
    fileName, setFileName,
    uploadProgress, setUploadProgress,
    summaryData, setSummaryData,
  };

  return (
    <SummaryTableContext.Provider value={value}>
      {children}
    </SummaryTableContext.Provider>
  );
};

export const useSummaryTable = () => {
  const context = useContext(SummaryTableContext);
  if (context === undefined) {
    throw new Error('useSummaryTable must be used within a SummaryTableProvider');
  }
  return context;
};