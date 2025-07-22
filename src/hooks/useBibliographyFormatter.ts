import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";
import { formatBibliography } from "@/functions";

export const useBibliographyFormatter = () => {
  const [sourceText, setSourceText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bibliography, setBibliography] = useState('');
  const [citationStyle, setCitationStyle] = useState('APA');
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
    setBibliography('');
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
          description: "הטקסט מהקובץ חולץ בהצלחה. כעת תוכל לעצב את הביבליוגרפיה.",
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

  const handleFormatBibliography = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא העלה קובץ כדי לעצב ביבליוגרפיה",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setBibliography('');

    try {
      const result = await formatBibliography({ text: sourceText, style: citationStyle });

      if (result && typeof result.bibliography === 'string') {
        setBibliography(result.bibliography);
        toast({
          title: "הצלחה!",
          description: `הביבליוגרפיה עברה עיצוב בהצלחה.`,
        });
      } else {
        throw new Error("Invalid data received");
      }
    } catch (error) {
      console.error("Error formatting bibliography:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעיצוב הביבליוגרפיה. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSourceText('');
    setFileName('');
    setBibliography('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    sourceText,
    fileName,
    isUploading,
    uploadProgress,
    isLoading,
    bibliography,
    citationStyle,
    setCitationStyle,
    fileInputRef,
    handleFileChange,
    handleFormatBibliography,
    handleReset,
  };
};