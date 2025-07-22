import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateChartsFromText } from "@/functions";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";

export interface ChartSuggestion {
  type: 'bar' | 'pie' | 'line' | 'area' | 'composed';
  title: string;
  description: string;
}

export type ChartData = Record<string, string | number>[];

export const useChartGenerator = () => {
  const [sourceText, setSourceText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chartSuggestions, setChartSuggestions] = useState<ChartSuggestion[]>([]);
  const [selectedChart, setSelectedChart] = useState<ChartSuggestion | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
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
    setChartSuggestions([]);
    setSelectedChart(null);
    setChartData(null);
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
          description: "הטקסט מהקובץ חולץ בהצלחה. כעת תוכל ליצור תרשימים.",
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClearFile = () => {
    setFileName('');
    setSourceText('');
    setUploadProgress('');
    setChartSuggestions([]);
    setSelectedChart(null);
    setChartData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGetSuggestions = async () => {
    if (!sourceText.trim()) {
      toast({ title: "שגיאה", description: "אנא הזן טקסט או העלה קובץ.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setChartSuggestions([]);
    setSelectedChart(null);
    setChartData(null);
    try {
      const result = await generateChartsFromText({ text: sourceText });
      if (result.suggestions && result.suggestions.length > 0) {
        setChartSuggestions(result.suggestions);
        toast({ title: "הצלחה!", description: "הנה כמה הצעות לגרפים שאפשר ליצור." });
      } else {
        toast({ title: "אין הצעות", description: "לא מצאנו הצעות לתרשימים בטקסט שסיפקת.", variant: "default" });
      }
    } catch (error) {
      console.error("Error getting suggestions:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({ title: "שגיאה", description: `אירעה שגיאה בקבלת הצעות: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateChart = async (suggestion: ChartSuggestion) => {
    setSelectedChart(suggestion);
    setIsLoading(true);
    setChartData(null);
    try {
      const result = await generateChartsFromText({
        text: sourceText,
        chartType: suggestion.type,
        chartTitle: suggestion.title,
      });
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        setChartData(result.data);
      } else {
        throw new Error("פורמט הנתונים שהתקבל אינו תקין או ריק.");
      }
    } catch (error) {
      console.error("Error generating chart:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({ title: "שגיאה", description: `אירעה שגיאה ביצירת הגרף: ${errorMessage}`, variant: "destructive" });
      setSelectedChart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setChartSuggestions([]);
    setSelectedChart(null);
    setChartData(null);
  };
  
  const handleFullReset = () => {
    setSourceText('');
    handleClearFile();
  };

  return {
    sourceText, setSourceText,
    fileName,
    isUploading,
    uploadProgress,
    isLoading,
    chartSuggestions,
    selectedChart,
    chartData,
    fileInputRef,
    handleFileChange,
    handleClearFile,
    handleGetSuggestions,
    handleGenerateChart,
    handleReset,
    handleFullReset,
  };
};