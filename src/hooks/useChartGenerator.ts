import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";
import { generateChartsFromText } from "@/functions";

export interface ChartData {
  title: string;
  type: 'bar' | 'pie' | 'line' | 'area' | 'radar' | 'treemap';
  data: { name: string; value: number }[];
  explanation: string;
}

export interface ChartsResponse {
  charts: ChartData[];
}

export const useChartGenerator = () => {
  // ... keep existing code (state variables and functions)
  const [sourceText, setSourceText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chartsData, setChartsData] = useState<ChartsResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // ... keep existing code (file handling logic)
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
    setChartsData(null);
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
          description: "הטקסט מהקובץ חולץ בהצלחה. כעת תוכל ליצור גרפים.",
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

  const handleGenerateCharts = async () => {
    // ... keep existing code (chart generation logic)
    if (!sourceText.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן טקסט או העלה קובץ כדי ליצור גרפים",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setChartsData(null);

    try {
      const result = await generateChartsFromText({ text: sourceText });

      if (result && result.charts && Array.isArray(result.charts)) {
        setChartsData(result as ChartsResponse);
        toast({
          title: "הצלחה!",
          description: `נוצרו ${result.charts.length} גרפים`,
        });
      } else {
        throw new Error("Invalid chart data received");
      }
    } catch (error) {
      console.error("Error generating charts:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת הגרפים. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // ... keep existing code (reset logic)
    setSourceText('');
    setFileName('');
    setChartsData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    sourceText, setSourceText,
    fileName,
    isUploading,
    uploadProgress,
    isLoading,
    chartsData,
    fileInputRef,
    handleFileChange,
    handleGenerateCharts,
    handleReset,
  };
};
