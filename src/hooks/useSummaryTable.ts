import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateSummaryTable, extractConcepts } from "@/functions";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";

export interface SummaryItem {
// ... keep existing code
}

export interface SummaryData {
// ... keep existing code
}

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const useSummaryTable = () => {
  const [topic, setTopic] = useState<string>(() => getInitialState('summaryTable:topic', ''));
  const [sourceText, setSourceText] = useState<string>(() => getInitialState('summaryTable:sourceText', ''));
  const [concepts, setConcepts] = useState<string[]>(() => getInitialState('summaryTable:concepts', ['']));
  const [language, setLanguage] = useState<string>(() => getInitialState('summaryTable:language', 'hebrew'));
  const [fileName, setFileName] = useState<string>(() => getInitialState('summaryTable:fileName', ''));
  const [summaryData, setSummaryData] = useState<SummaryData | null>(() => getInitialState('summaryTable:summaryData', null));
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtractingConcepts, setIsExtractingConcepts] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('summaryTable:topic', JSON.stringify(topic));
      localStorage.setItem('summaryTable:sourceText', JSON.stringify(sourceText));
      localStorage.setItem('summaryTable:concepts', JSON.stringify(concepts));
      localStorage.setItem('summaryTable:language', JSON.stringify(language));
      localStorage.setItem('summaryTable:fileName', JSON.stringify(fileName));
      localStorage.setItem('summaryTable:summaryData', JSON.stringify(summaryData));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [topic, sourceText, concepts, language, fileName, summaryData]);


  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
// ... keep existing code
  };

  const addConcept = () => {
// ... keep existing code
  };

  const removeConcept = (index: number) => {
// ... keep existing code
  };

  const updateConcept = (index: number, value: string) => {
// ... keep existing code
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
// ... keep existing code
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
// ... keep existing code
      return;
    }

    // Clear previous state before upload
    setTopic('');
    setSourceText('');
    setConcepts(['']);
    setSummaryData(null);
    setFileName(selectedFile.name);
    setIsUploading(true);
    setUploadProgress('מעלה קובץ...');

    try {
// ... keep existing code
      const { file_url } = await withTimeout(
        uploadFile({ file: selectedFile }), 
        120000
      );

// ... keep existing code
      const schema = {
        type: "object",
        properties: {
          text_content: {
            type: "string",
            description: "The full text content of the document, preserving original language (Hebrew or English).",
          },
        },
        required: ["text_content"],
      };

      const result = await withTimeout(
// ... keep existing code
      );

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
// ... keep existing code
      } else {
        throw new Error(result.details || "Failed to extract text from PDF.");
      }
    } catch (error) {
// ... keep existing code
      
      toast({
        title: "שגיאה בעיבוד הקובץ",
        description: description,
        variant: "destructive",
      });
      setFileName('');
      setUploadProgress('');
    } finally {
// ... keep existing code
    }
  };

  const handleClearFile = () => {
    setFileName('');
    setSourceText('');
    setUploadProgress('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    localStorage.removeItem('summaryTable:fileName');
    localStorage.removeItem('summaryTable:sourceText');
  };

  const handleResetAll = () => {
    setTopic('');
    setSourceText('');
    setConcepts(['']);
    setLanguage('hebrew');
    setFileName('');
    setSummaryData(null);
    setUploadProgress('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "הכל נוקה",
      description: "כל הנתונים והטבלה שנוצרה נמחקו.",
    });
  };

  const handleExtractConcepts = async () => {
// ... keep existing code
  };

  const handleGenerate = async () => {
// ... keep existing code
  };

  return {
    // State
    topic, setTopic,
    sourceText, setSourceText,
    concepts, setConcepts,
    language, setLanguage,
    isLoading,
    isUploading,
    isExtractingConcepts,
    uploadProgress,
    fileName,
    summaryData,
    fileInputRef,
    
    // Actions
    addConcept,
    removeConcept,
    updateConcept,
    handleFileChange,
    handleClearFile,
    handleExtractConcepts,
    handleGenerate,
    handleResetAll,
  };
};
