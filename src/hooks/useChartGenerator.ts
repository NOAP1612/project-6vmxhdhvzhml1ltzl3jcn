import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateChartsFromText } from "@/functions";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";

export interface ChartData {
  title: string;
  type: 'bar' | 'pie' | 'line' | 'area';
  data: { name: string; value: number | string; [key: string]: any }[];
}

export interface ChartsResponse {
  charts: ChartData[];
}

export const useChartGenerator = () => {
  const [sourceText, setSourceText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
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
    setChartsData(null);

    try {
      toast({ title: "מעלה קובץ...", description: "שלב 1/2: מעלה קובץ..." });
      const { file_url } = await withTimeout(uploadFile({ file: selectedFile }), 300000);
      
      toast({ title: "מעבד קובץ...", description: "שלב 2/2: מחלץ טקסט..." });
      const schema = {
        type: "object",
        properties: { text_content: { type: "string" } },
        required: ["text_content"],
      };
      const result = await withTimeout(extractDataFromUploadedFile({ file_url, json_schema: schema }), 600000);

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
        setSourceText((result.output as { text_content: string }).text_content);
        toast({ title: "הצלחה!", description: "הטקסט חולץ בהצלחה." });
      } else {
        throw new Error(result.details || "Failed to extract text from PDF.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({ title: "שגיאה בעיבוד הקובץ", description: "לא הצלחנו לחלץ את הטקסט מהקובץ.", variant: "destructive" });
      setFileName('');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateCharts = async () => {
    if (!sourceText.trim()) {
      toast({ title: "שגיאה", description: "אנא הזן טקסט או העלה קובץ.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setChartsData(null);

    try {
      const result = await generateChartsFromText({ text: sourceText });
      if (result && result.charts && Array.isArray(result.charts) && result.charts.length > 0) {
        setChartsData(result as ChartsResponse);
        toast({ title: "הצלחה!", description: `נוצרו ${result.charts.length} גרפים.` });
      } else {
        throw new Error("לא התקבל מידע תקין ליצירת גרפים.");
      }
    } catch (error) {
      console.error("Error generating charts:", error);
      toast({ title: "שגיאה ביצירת גרפים", description: (error as Error).message || "אירעה שגיאה. אנא נסה שוב.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setSourceText('');
    setFileName('');
    setChartsData(null);
    setIsLoading(false);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    sourceText, setSourceText,
    fileName,
    isUploading,
    isLoading,
    chartsData,
    fileInputRef,
    handleFileChange,
    handleGenerateCharts,
    handleReset,
  };
};