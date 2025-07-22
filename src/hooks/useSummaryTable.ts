import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateSummaryTable, extractConcepts } from "@/functions";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";

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

export const useSummaryTable = () => {
  const [topic, setTopic] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [concepts, setConcepts] = useState<string[]>(['']);
  const [language, setLanguage] = useState('hebrew');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtractingConcepts, setIsExtractingConcepts] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [fileName, setFileName] = useState('');
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  };

  const addConcept = () => {
    setConcepts([...concepts, '']);
  };

  const removeConcept = (index: number) => {
    if (concepts.length > 1) {
      setConcepts(concepts.filter((_, i) => i !== index));
    }
  };

  const updateConcept = (index: number, value: string) => {
    const newConcepts = [...concepts];
    newConcepts[index] = value;
    setConcepts(newConcepts);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: "קובץ לא נתמך",
        description: "אנא העלה קובץ PDF בלבד.",
        variant: "destructive",
      });
      return;
    }

    setFileName(selectedFile.name);
    setIsUploading(true);
    setSourceText('');
    setConcepts(['']);
    setSummaryData(null);
    setUploadProgress('מעלה קובץ...');

    try {
      toast({
        title: "מעלה קובץ...",
        description: "שלב 1 מתוך 2: מעלה את הקובץ לשרת.",
      });

      const { file_url } = await withTimeout(
        uploadFile({ file: selectedFile }), 
        300000 // Increased timeout to 5 minutes
      );

      setUploadProgress('מעבד את הקובץ...');
      toast({
        title: "מעבד את הקובץ...",
        description: "שלב 2 מתוך 2: מחלץ טקסט מהקובץ.",
      });

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
        extractDataFromUploadedFile({
          file_url,
          json_schema: schema,
        }),
        600000 // Increased timeout to 10 minutes
      );

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
        const content = (result.output as { text_content: string }).text_content;
        setSourceText(content);
        setUploadProgress('הושלם בהצלחה!');
        toast({
          title: "הצלחה!",
          description: "הטקסט מהקובץ חולץ בהצלחה. כעת תוכל לחלץ מושגים אוטומטית.",
        });
      } else {
        throw new Error(result.details || "Failed to extract text from PDF.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      let description = "לא הצלחנו לחלץ את הטקסט מהקובץ. אנא ודא שהקובץ תקין ונסה שוב.";
      
      if (error instanceof Error) {
        if (error.message === 'Request timeout') {
          description = "הבקשה ארכה יותר מדי זמן. אנא נסה שוב עם קובץ קטן יותר.";
        } else if (error.message === 'Failed to fetch') {
          description = "אירעה שגיאת רשת. אנא בדוק את חיבור האינטרנט ונסה שוב.";
        }
      }
      
      toast({
        title: "שגיאה בעיבוד הקובץ",
        description: description,
        variant: "destructive",
      });
      setFileName('');
      setUploadProgress('');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearFile = () => {
    setFileName('');
    setSourceText('');
    setUploadProgress('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExtractConcepts = async () => {
    const textToAnalyze = sourceText || topic;
    
    if (!textToAnalyze.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן טקסט או העלה קובץ כדי לחלץ מושגים",
        variant: "destructive",
      });
      return;
    }

    if (!topic.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן נושא לטבלה",
        variant: "destructive",
      });
      return;
    }

    setIsExtractingConcepts(true);
    try {
      const result = await extractConcepts({
        text: textToAnalyze,
        topic: topic,
        language: language
      });

      if (result.concepts && Array.isArray(result.concepts)) {
        setConcepts(result.concepts);
        toast({
          title: "הצלחה!",
          description: `חולצו ${result.concepts.length} מושגים מהטקסט`,
        });
      } else {
        throw new Error("לא הצלחנו לחלץ מושגים מהטקסט");
      }
    } catch (error) {
      console.error("Error extracting concepts:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בחילוץ המושגים. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsExtractingConcepts(false);
    }
  };

  const handleGenerate = async () => {
    const validConcepts = concepts.filter(c => c.trim());
    
    if (!topic.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן נושא לטבלה",
        variant: "destructive",
      });
      return;
    }

    if (validConcepts.length === 0) {
      toast({
        title: "שגיאה",
        description: "אנא הזן לפחות מושג אחד",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateSummaryTable({
        topic,
        concepts: validConcepts,
        language
      });

      if (result.summary) {
        setSummaryData(result);
        toast({
          title: "הצלחה!",
          description: `נוצרה טבלת סיכום עם ${result.summary.length} מושגים`,
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת הטבלה. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
  };
};
