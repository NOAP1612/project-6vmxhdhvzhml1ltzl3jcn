import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createQuizQuestions } from "@/functions";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";
import { QuizHeader } from './quiz-generator/QuizHeader';
import { QuizSettings } from './quiz-generator/QuizSettings';
import { QuestionsList } from './quiz-generator/QuestionsList';

interface Question {
// ... keep existing code
}

export function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState('5');
  const [questionType, setQuestionType] = useState('mixed');
  const [language, setLanguage] = useState('hebrew');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAnswers, setShowAnswers] = useState<boolean[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
// ... keep existing code
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
    setTopic('');
    setQuestions([]);
    setUploadProgress('מעלה קובץ...');

    try {
      toast({
        title: "מעלה קובץ...",
        description: "שלב 1 מתוך 2: מעלה את הקובץ לשרת.",
      });

      const { file_url } = await withTimeout(
        uploadFile({ file: selectedFile }), 
        120000
      );

      setUploadProgress('מעבד את הקובץ...');
      toast({
        title: "מעבד את הקובץ...",
        description: "שלב 2 מתוך 2: מחלץ טקסט מהקובץ. זה עשוי לקחת מספר רגעים...",
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
        300000
      );

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
        const content = (result.output as { text_content: string }).text_content;
        setTopic(content);
        setUploadProgress('הושלם בהצלחה!');
        toast({
          title: "הצלחה!",
          description: "הטקסט מהקובץ חולץ בהצלחה ומוכן ליצירת שאלון.",
        });
      } else {
        throw new Error(result.details || "Failed to extract text from PDF.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      let description = "לא הצלחנו לחלץ את הטקסט מהקובץ. אנא ודא שהקובץ תקין ונסה שוב.";
      
      if (error instanceof Error) {
        if (error.message === 'Request timeout') {
          description = "הבקשה ארכה יותר מדי זמן. אנא נסה שוב עם קובץ קטן יותר או בדוק את חיבור האינטרנט שלך.";
        } else if (error.message === 'Failed to fetch') {
          description = "אירעה שגיאת רשת בעת עיבוד הקובץ. אנא בדוק את חיבור האינטרנט שלך ונסה שוב. אם הבעיה נמשכת, ייתכן שיש בעיה זמנית בשרת.";
        } else {
          description = `אירעה שגיאה: ${error.message}`;
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
    setTopic('');
    setUploadProgress('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
// ... keep existing code
  };

  const toggleAnswer = (index: number) => {
// ... keep existing code
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <QuizHeader />
      <QuizSettings
        isUploading={isUploading}
        fileName={fileName}
        handleFileChange={handleFileChange}
        handleClearFile={handleClearFile}
        uploadProgress={uploadProgress}
        fileInputRef={fileInputRef}
        topic={topic}
        setTopic={setTopic}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        questionType={questionType}
        setQuestionType={setQuestionType}
        language={language}
        setLanguage={setLanguage}
        handleGenerate={handleGenerate}
        isLoading={isLoading}
      />
      <QuestionsList
// ... keep existing code
      />
    </div>
  );
}
