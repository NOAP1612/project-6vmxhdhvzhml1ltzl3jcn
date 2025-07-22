import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createQuizQuestions, processDriveLink } from "@/functions";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";
import { QuizHeader } from './quiz-generator/QuizHeader';
import { QuizSettings } from './quiz-generator/QuizSettings';
import { QuestionsList } from './quiz-generator/QuestionsList';

interface Question {
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
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
  const [driveLink, setDriveLink] = useState('');
  const [isProcessingDrive, setIsProcessingDrive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  };

  const handleDriveLinkProcess = async () => {
    if (!driveLink.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן קישור לקובץ בדרייב",
        variant: "destructive",
      });
      return;
    }

    const drivePatterns = [
      /drive\.google\.com\/file\/d\/[a-zA-Z0-9-_]+/,
      /drive\.google\.com\/open\?id=[a-zA-Z0-9-_]+/,
      /docs\.google\.com\/document\/d\/[a-zA-Z0-9-_]+/
    ];

    const isValidDriveLink = drivePatterns.some(pattern => pattern.test(driveLink));
    
    if (!isValidDriveLink) {
      toast({
        title: "קישור לא תקין",
        description: "אנא הזן קישור תקין לקובץ בגוגל דרייב",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingDrive(true);
    setTopic('');
    setQuestions([]);
    setFileName('');

    try {
      toast({
        title: "מעבד קישור דרייב...",
        description: "מחלץ טקסט מהקובץ בדרייב. זה עשוי לקחת מספר רגעים...",
      });

      const result = await withTimeout(
        processDriveLink({ driveLink }),
        180000 // 3 minutes timeout
      );

      if (result.success && result.text_content) {
        setTopic(result.text_content);
        toast({
          title: "הצלחה!",
          description: "הטקסט מהקובץ בדרייב חולץ בהצלחה ומוכן ליצירת שאלון.",
        });
      } else {
        throw new Error(result.error || "Failed to extract text from Drive file");
      }
    } catch (error) {
      console.error("Error processing drive link:", error);
      let description = "לא הצלחנו לחלץ את הטקסט מהקובץ בדרייב. אנא ודא שהקישור תקין והקובץ נגיש.";
      
      if (error instanceof Error) {
        if (error.message.includes('No domain found for deployment')) {
          description = "אירעה שגיאת תצורה בשרת. ייתכן שהשירות האחראי על עיבוד קבצי דרייב אינו זמין כרגע. אנא נסה שוב מאוחר יותר.";
        } else if (error.message === 'Request timeout') {
          description = "הבקשה ארכה יותר מדי זמן. אנא נסה שוב או בדוק את חיבור האינטרנט שלך.";
        } else if (error.message === 'Failed to fetch') {
          description = "אירעה שגיאת רשת. אנא בדוק את חיבור האינטרנט שלך ונסה שוב.";
        } else {
          description = `אירעה שגיאה: ${error.message}`;
        }
      }
      
      toast({
        title: "שגיאה בעיבוד קישור הדרייב",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsProcessingDrive(false);
    }
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
    setDriveLink('');
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
    setDriveLink('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן נושא לשאלון",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createQuizQuestions({
        topic,
        numQuestions: parseInt(numQuestions),
        questionType,
        language
      });

      if (result.questions) {
        setQuestions(result.questions);
        setShowAnswers(new Array(result.questions.length).fill(false));
        toast({
          title: "הצלחה!",
          description: `נוצרו ${result.questions.length} שאלות בהצלחה`,
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת השאלות. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAnswer = (index: number) => {
    const newShowAnswers = [...showAnswers];
    newShowAnswers[index] = !newShowAnswers[index];
    setShowAnswers(newShowAnswers);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <QuizHeader />
      <QuizSettings
        driveLink={driveLink}
        setDriveLink={setDriveLink}
        handleDriveLinkProcess={handleDriveLinkProcess}
        isProcessingDrive={isProcessingDrive}
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
        questions={questions}
        topic={topic}
        showAnswers={showAnswers}
        toggleAnswer={toggleAnswer}
      />
    </div>
  );
}
