import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { invokeLLM, uploadFile, extractDataFromUploadedFile } from "@/integrations/core";

export interface QuizQuestion {
// ... keep existing code (interface definition)
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
  isChecked?: boolean; // Add this to track individual question state
}

export interface QuizData {
// ... keep existing code (interface definition)
  title: string;
  questions: QuizQuestion[];
}

export const useQuizGenerator = () => {
// ... keep existing code (state declarations)
  const [questionCount, setQuestionCount] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
// ... keep existing code (file type check)
    setUploadProgress('מעלה קובץ...');

    try {
       toast({
        title: "מעלה קובץ...",
        description: "שלב 1 מתוך 2: מעלה את הקובץ לשרת.",
      });
      const { file_url } = await withTimeout(uploadFile({ file: selectedFile }), 300000); // Increased timeout to 5 minutes
      
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

      const result = await withTimeout(extractDataFromUploadedFile({ file_url, json_schema: schema }), 600000); // Increased timeout to 10 minutes

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
// ... keep existing code (success handling)
      } else {
        throw new Error(result.details || "Failed to extract text from PDF.");
      }
    } catch (error) {
// ... keep existing code (error handling)
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

// ... keep existing code (rest of the hook)
  const handleReset = () => {
// ... keep existing code (handleReset function)
    setSourceText('');
    setFileName('');
    setQuizData(null);
    setUserAnswers({});
    setIsSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
// ... keep existing code (return statement)
    sourceText, setSourceText,
    fileName,
    isUploading,
    uploadProgress,
    isLoading,
    quizData,
    userAnswers,
    isSubmitted,
    questionCount,
    setQuestionCount,
    fileInputRef,
    handleFileChange,
    handleGenerateQuiz,
    handleAnswerChange,
    handleCheckAnswer, // Expose the new function
    handleReset,
  };
};
