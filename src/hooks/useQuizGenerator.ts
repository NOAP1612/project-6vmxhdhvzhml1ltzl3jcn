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
      const prompt = `You are an expert quiz creator for university students. Your task is to generate a multiple-choice quiz in Hebrew with ${questionCount} questions based on the provided academic text.

CRITICAL INSTRUCTIONS:
1. DEEP CONCEPTUAL QUESTIONS: Generate questions that test deep understanding of the core concepts, arguments, and data presented in the text. Avoid superficial questions.
2. IGNORE METADATA: DO NOT create questions about the text's structure, titles, chapter names, or section numbers. Focus on the content itself.
3. UNIQUE AND DISTINCT ANSWERS: For each question, ensure that all 4 answer options (including the correct and incorrect ones) are unique, distinct, and plausible. Do not repeat answers.
4. HEBREW LANGUAGE: The entire quiz (title, questions, options, explanation) must be in Hebrew.
5. QUESTION FORMAT: Ensure every question ends with a question mark (?).
6. EXPLANATION: For each question, provide a brief explanation for the correct answer.

Here is the text:
${sourceText}

Please provide a concise title for the quiz that reflects the main topic of the text.

Generate the quiz now based only on the substantive content of the text above.
Return the result in the specified JSON format.`;

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
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleCheckAnswer = (questionIndex: number) => {
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