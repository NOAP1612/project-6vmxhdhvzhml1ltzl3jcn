import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { invokeLLM, uploadFile, extractDataFromUploadedFile } from "@/integrations/core";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
  isChecked?: boolean; // Add this to track individual question state
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export const useQuizGenerator = () => {
  const [sourceText, setSourceText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
// ... keep existing code
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
// ... keep existing code
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
    setQuizData(null);
    setUserAnswers({});
    setIsSubmitted(false);
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
        const content = (result.output as { text_content: string }).text_content;
        setSourceText(content);
        setUploadProgress('הושלם בהצלחה!');
        toast({
          title: "הצלחה!",
          description: "הטקסט מהקובץ חולץ בהצלחה. כעת תוכל ליצור חידון.",
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

  const handleGenerateQuiz = async () => {
// ... keep existing code
    if (!sourceText.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן טקסט או העלה קובץ כדי ליצור חידון",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setQuizData(null);
    setUserAnswers({});
    setIsSubmitted(false);

    try {
      const prompt = `צור חידון בעברית עם ${questionCount} שאלות על הטקסט הבא. כל שאלה צריכה להיות עם 4 אפשרויות תשובה, תשובה נכונה אחת, והסבר קצר. ודא שהשאלות מסתיימות בסימן שאלה.

טקסט:
${sourceText}

החזר את התוצאה בפורמט JSON הבא:
{
  "title": "כותרת החידון",
  "questions": [
    {
      "question": "השאלה כאן?",
      "options": ["אפשרות 1", "אפשרות 2", "אפשרות 3", "אפשרות 4"],
      "correctAnswer": "התשובה הנכונה",
      "explanation": "הסבר קצר למה זו התשובה הנכונה"
    }
  ]
}`;

      const result = await invokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correctAnswer: { type: "string" },
                  explanation: { type: "string" }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["title", "questions"]
        }
      });

      if (result && result.questions && Array.isArray(result.questions)) {
        setQuizData(result as QuizData);
        toast({
          title: "הצלחה!",
          description: `נוצר חידון עם ${result.questions.length} שאלות`,
        });
      } else {
        throw new Error("Invalid quiz data received");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת החידון. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
// ... keep existing code
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleCheckAnswer = (questionIndex: number) => {
// ... keep existing code
    if (!quizData) return;

    const question = quizData.questions[questionIndex];
    const userAnswer = userAnswers[questionIndex];
    
    if (!userAnswer) {
      toast({
        title: "שגיאה",
        description: "אנא בחר תשובה לפני הבדיקה",
        variant: "destructive",
      });
      return;
    }

    const isCorrect = userAnswer === question.correctAnswer;
    
    // Update the question with the check result
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex] = {
      ...question,
      userAnswer,
      isCorrect,
      isChecked: true
    };

    setQuizData({
      ...quizData,
      questions: updatedQuestions
    });

    toast({
      title: isCorrect ? "נכון!" : "לא נכון",
      description: isCorrect ? "תשובה מצוינת!" : question.explanation,
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const handleReset = () => {
// ... keep existing code
    setSourceText('');
    setFileName('');
    setQuizData(null);
    setUserAnswers({});
    setIsSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
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
    handleCheckAnswer,
    handleReset,
  };
};
