import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";
import { presentationSlidesFromText } from "@/functions";
import { ChartData } from '@/hooks/useChartGenerator';

export interface Slide {
  title: string;
  content: string[];
  visual: {
    type: 'chart' | 'image';
    data?: ChartData;
    url?: string;
  } | null;
  // Removed visualSuggestion completely
}

export interface PresentationData {
  title: string;
  slides: Slide[];
}

export const usePresentationGenerator = () => {
  // ... keep existing code (state variables)
  const [topic, setTopic] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [fileName, setFileName] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [selectedTheme, setSelectedTheme] = useState('modern');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const themes = [
    { id: 'modern', name: 'מודרני', colors: 'from-blue-600 to-purple-600' },
    { id: 'professional', name: 'מקצועי', colors: 'from-gray-700 to-blue-800' },
    { id: 'creative', name: 'יצירתי', colors: 'from-pink-500 to-orange-500' },
    { id: 'nature', name: 'טבע', colors: 'from-green-600 to-teal-600' },
    { id: 'elegant', name: 'אלגנטי', colors: 'from-purple-800 to-indigo-900' }
  ];

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    // ... keep existing code (timeout function)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // ... keep existing code (handleFileChange function)
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.type.startsWith('text/')) {
      toast({
        title: "קובץ לא נתמך",
        description: "אנא העלה קובץ PDF או טקסט בלבד.",
        variant: "destructive",
      });
      return;
    }

    setFileName(selectedFile.name);
    setIsUploading(true);
    setSourceText('');
    setPresentationData(null);
    setUploadProgress('מעלה קובץ...');

    try {
      toast({
        title: "מעלה קובץ...",
        description: "שלב 1 מתוך 2: מעלה את הקובץ לשרת.",
      });
      const { file_url } = await withTimeout(uploadFile({ file: selectedFile }), 300000);

      setUploadProgress('מעבד את הקובץ...');
      toast({
        title: "מעבד את הקובץ...",
        description: "שלב 2 מתוך 2: מחלץ טקסט מהקובץ.",
      });
      
      const schema = {
        type: "object",
        properties: { text_content: { type: "string" } },
        required: ["text_content"],
      };

      const result = await withTimeout(extractDataFromUploadedFile({ file_url, json_schema: schema }), 600000);

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
        const content = (result.output as { text_content: string }).text_content;
        setSourceText(content);
        setUploadProgress('הושלם בהצלחה!');
        toast({
          title: "הצלחה!",
          description: "הטקסט מהקובץ חולץ בהצלחה. כעת תוכל ליצור מצגת.",
        });
      } else {
        throw new Error(result.details || "Failed to extract text from file.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      let description = "לא הצלחנו לחלץ את הטקסט מהקובץ. אנא ודא שהקובץ תקין ונסה שוב.";
      if (error instanceof Error && error.message === 'Request timeout') {
        description = "הבקשה ארכה יותר מדי זמן. אנא נסה שוב עם קובץ קטן יותר.";
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGeneratePresentation = async () => {
    // ... keep existing code (handleGeneratePresentation function, with updated result handling)
    const textToAnalyze = sourceText || topic;
    
    if (!textToAnalyze.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן טקסט או העלה קובץ כדי ליצור מצגת",
        variant: "destructive",
      });
      return;
    }

    if (!topic.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן נושא למצגת",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPresentationData(null);
    toast({
      title: "יוצר מצגת...",
      description: "זה עשוי לקחת מספר דקות, תלוי במורכבות התוכן...",
    });

    try {
      const result = await presentationSlidesFromText({
        text: textToAnalyze,
        slideCount: slideCount,
        topic: topic
      });

      if (result && result.slides && Array.isArray(result.slides)) {
        setPresentationData(result as PresentationData);
        const chartCount = result.slides.filter((s: any) => s.visual?.type === 'chart').length;
        toast({
          title: "הצלחה!",
          description: `נוצרה מצגת עם ${result.slides.length} שקופיות ו-${chartCount} גרפים`,
        });
      } else {
        throw new Error("Invalid presentation data received");
      }
    } catch (error) {
      console.error("Error generating presentation:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת המצגת. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // ... keep existing code (handleReset function)
    setTopic('');
    setSourceText('');
    setFileName('');
    setPresentationData(null);
    setSlideCount(5);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    // State
    topic, setTopic,
    sourceText, setSourceText,
    fileName,
    slideCount, setSlideCount,
    isUploading,
    uploadProgress,
    isLoading,
    presentationData,
    selectedTheme, setSelectedTheme,
    themes,
    fileInputRef,
    
    // Actions
    handleFileChange,
    handleGeneratePresentation,
    handleReset,
  };
};
