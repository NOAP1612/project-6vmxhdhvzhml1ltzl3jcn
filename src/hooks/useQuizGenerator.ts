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
  const [sourceText, setSourceText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false); // This will now represent if the whole quiz is "finished"
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
    setUploadProgress('מעלה קובץ...');

    try {
       toast({
        title: "מעלה קובץ...",
        description: "שלב 1 מתוך 2: מעלה את הקובץ לשרת.",
      });
      const { file_url } = await withTimeout(uploadFile({ file: selectedFile }), 120000);
      
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

      const result = await withTimeout(extractDataFromUploadedFile({ file_url, json_schema: schema }), 300000);

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
        setSourceText((result.output as any).text_content);
        toast({ title: "הצלחה!", description: "הטקסט מהקובץ חולץ בהצלחה." });
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
// ... keep existing code (handleGenerateQuiz function)
    if (!sourceText.trim()) {
      toast({
        title: "אין טקסט",
        description: "אנא הדבק טקסט או העלה קובץ כדי ליצור שאלון.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setQuizData(null);

    try {
      const quizSchema = {
        type: "object",
        properties: {
          title: { type: "string", description: "כותרת קצרה וקליטה לשאלון" },
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string", description: "נוסח השאלה, חייב להסתיים בסימן שאלה בסוף המשפט." },
                options: { type: "array", items: { type: "string" }, description: "4 אפשרויות תשובה" },
                correctAnswer: { type: "string", description: "התשובה הנכונה מבין האפשרויות" },
                explanation: { type: "string", description: "הסבר קצר מדוע זו התשובה הנכונה" }
              },
              required: ["question", "options", "correctAnswer", "explanation"],
            },
          },
        },
        required: ["title", "questions"],
      };

      const result = await invokeLLM({
        prompt: `צור שאלון אינטראקטיבי המבוסס על הטקסט הבא. השאלון צריך לכלול ${questionCount} שאלות אמריקאיות עם 4 אפשרויות כל אחת. ודא שהשאלות מכסות את הנושאים המרכזיים בטקסט. עבור כל שאלה, ספק הסבר קצר לתשובה הנכונה. חשוב מאוד: ודא שכל שאלה מנוסחת כהלכה ומסתיימת בסימן שאלה בסוף המשפט (לדוגמה: 'מהי בירת צרפת?'). הטקסט: """${sourceText}"""`,
        response_json_schema: quizSchema,
      });

      setQuizData(result as QuizData);
      toast({ title: "הצלחה!", description: "השאלון נוצר בהצלחה." });
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "שגיאה ביצירת השאלון",
        description: "לא הצלחנו ליצור את השאלון. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
// ... keep existing code (handleAnswerChange function)
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleCheckAnswer = (questionIndex: number) => {
// ... keep existing code (handleCheckAnswer function)
    if (!quizData || !userAnswers[questionIndex]) return;

    const updatedQuestions = [...quizData.questions];
    const question = updatedQuestions[questionIndex];
    const userAnswer = userAnswers[questionIndex];
    const isCorrect = userAnswer === question.correctAnswer;

    updatedQuestions[questionIndex] = {
      ...question,
      userAnswer,
      isCorrect,
      isChecked: true,
    };

    setQuizData({ ...quizData, questions: updatedQuestions });

    const allChecked = updatedQuestions.every(q => q.isChecked);
    if (allChecked) {
      setIsSubmitted(true);
      const correctCount = updatedQuestions.filter(q => q.isCorrect).length;
      toast({
        title: "כל הכבוד, סיימת את השאלון!",
        description: `הציון הסופי שלך הוא ${correctCount} מתוך ${updatedQuestions.length}`,
      });
    }
  };

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
