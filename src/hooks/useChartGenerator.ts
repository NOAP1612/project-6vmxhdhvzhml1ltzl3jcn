import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { invokeLLM, uploadFile, extractDataFromUploadedFile } from "@/integrations/core";

export interface ChartSuggestion {
  title: string;
  description: string;
  type: 'bar' | 'pie' | 'line' | 'area' | 'composed';
}

export interface ChartData {
  name: string;
  value: number;
}

export const useChartGenerator = () => {
  const [sourceText, setSourceText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chartSuggestions, setChartSuggestions] = useState<ChartSuggestion[]>([]);
  const [selectedChart, setSelectedChart] = useState<ChartSuggestion | null>(null);
  const [chartData, setChartData] = useState<ChartData[] | null>(null);
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
      toast({ title: "קובץ לא נתמך", description: "אנא העלה קובץ PDF בלבד.", variant: "destructive" });
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
      toast({ title: "מעלה קובץ...", description: "שלב 1 מתוך 2: מעלה את הקובץ לשרת." });
      const { file_url } = await withTimeout(uploadFile({ file: selectedFile }), 300000);

      setUploadProgress('מעבד את הקובץ...');
      toast({ title: "מעבד את הקובץ...", description: "שלב 2 מתוך 2: מחלץ טקסט מהקובץ." });
      
      const schema = { type: "object", properties: { text_content: { type: "string" } }, required: ["text_content"] };
      const result = await withTimeout(extractDataFromUploadedFile({ file_url, json_schema: schema }), 600000);

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
        setSourceText((result.output as { text_content: string }).text_content);
        setUploadProgress('הושלם בהצלחה!');
        toast({ title: "הצלחה!", description: "הטקסט מהקובץ חולץ בהצלחה. כעת תוכל לקבל הצעות לתרשימים." });
      } else {
        throw new Error(result.details || "Failed to extract text from PDF.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      let description = "לא הצלחנו לחלץ את הטקסט מהקובץ. אנא ודא שהקובץ תקין ונסה שוב.";
      if (error instanceof Error) {
        if (error.message === 'Request timeout') description = "הבקשה ארכה יותר מדי זמן. אנא נסה שוב עם קובץ קטן יותר.";
        else if (error.message === 'Failed to fetch') description = "אירעה שגיאת רשת. אנא בדוק את חיבור האינטרנט ונסה שוב.";
      }
      toast({ title: "שגיאה בעיבוד הקובץ", description, variant: "destructive" });
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGetSuggestions = async () => {
    if (!sourceText.trim()) {
      toast({ title: "שגיאה", description: "אנא הזן טקסט או העלה קובץ כדי לקבל הצעות", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setChartSuggestions([]);
    try {
      const prompt = `Based on the following text, suggest up to 5 ideas for charts (bar, pie, line, area). For each suggestion, provide a title, a short description, and the chart type.

Text:
${sourceText}

Return the result in the following JSON format:
{
  "suggestions": [
    {
      "title": "Chart Title",
      "description": "A short description of what the chart shows.",
      "type": "bar"
    }
  ]
}`;
      const result = await invokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  type: { type: "string", enum: ["bar", "pie", "line", "area", "composed"] }
                },
                required: ["title", "description", "type"]
              }
            }
          },
          required: ["suggestions"]
        }
      });
      if (result && result.suggestions) {
        setChartSuggestions(result.suggestions as ChartSuggestion[]);
        toast({ title: "הצלחה!", description: `מצאנו ${result.suggestions.length} הצעות לתרשימים.` });
      } else {
        throw new Error("Invalid suggestions data received");
      }
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast({ title: "שגיאה", description: "אירעה שגיאה בקבלת ההצעות. אנא נסה שוב.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateChart = async (suggestion: ChartSuggestion) => {
    setSelectedChart(suggestion);
    setIsLoading(true);
    setChartData(null);
    try {
      const prompt = `Based on the following text and the chart suggestion, generate the data for the chart.

Text:
${sourceText}

Chart Suggestion:
Title: ${suggestion.title}
Description: ${suggestion.description}
Type: ${suggestion.type}

Return the data in the following JSON format, with at least 3 data points:
{
  "data": [
    {"name": "Category 1", "value": 10},
    {"name": "Category 2", "value": 20}
  ]
}`;
      const result = await invokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  value: { type: "number" }
                },
                required: ["name", "value"]
              }
            }
          },
          required: ["data"]
        }
      });
      if (result && result.data) {
        setChartData(result.data as ChartData[]);
      } else {
        throw new Error("Invalid chart data received");
      }
    } catch (error) {
      console.error("Error generating chart:", error);
      toast({ title: "שגיאה", description: "אירעה שגיאה ביצירת התרשים. אנא נסה שוב.", variant: "destructive" });
      setSelectedChart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedChart(null);
    setChartData(null);
  };
  
  const handleFullReset = () => {
    setSourceText('');
    setFileName('');
    setChartSuggestions([]);
    setSelectedChart(null);
    setChartData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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