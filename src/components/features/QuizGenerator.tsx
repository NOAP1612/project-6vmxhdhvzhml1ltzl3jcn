import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileQuestion, Loader2, Upload, X, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateInteractiveQuiz } from "@/functions";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";
import { InteractiveQuiz } from "./InteractiveQuiz";

interface Question {
  id: string;
  question: string;
  type: 'multiple' | 'open';
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      const result = await generateInteractiveQuiz({
        topic,
        numQuestions: parseInt(numQuestions),
        questionType,
        language
      });

      if (result.questions) {
        setQuestions(result.questions);
        toast({
          title: "הצלחה!",
          description: `נוצרו ${result.questions.length} שאלות בהצלחה`,
        });
      }
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת השאלות. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuestions([]);
    setTopic('');
    setFileName('');
    setUploadProgress('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // פונקציה עם timeout משופר
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

  if (questions.length > 0) {
    return <InteractiveQuiz questions={questions} onReset={handleReset} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <FileQuestion className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">יצירת שאלון</h1>
          <p className="text-gray-600">צור שאלות מותאמות אישית לכל נושא</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הגדרות השאלון</CardTitle>
          <CardDescription>
            הזן את פרטי השאלון שברצונך ליצור, או העלה קובץ PDF כדי ליצור שאלון מהתוכן שלו.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>יצירה מתוך קובץ PDF (אופציונלי)</Label>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="pdf-upload"
                className={`flex-grow flex items-center justify-center gap-2 cursor-pointer rounded-md border-2 border-dashed p-4 text-center text-gray-500 transition-colors hover:border-blue-500 hover:bg-blue-50 ${isUploading ? 'cursor-not-allowed bg-gray-100' : 'border-gray-300'}`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{uploadProgress}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>{fileName || 'לחץ לבחירת קובץ PDF'}</span>
                  </>
                )}
              </Label>
              <Input
                id="pdf-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="application/pdf"
                disabled={isUploading}
                ref={fileInputRef}
              />
              {fileName && !isUploading && (
                <Button variant="ghost" size="icon" onClick={handleClearFile} className="shrink-0">
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
            
            {isUploading && (
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-800 font-medium">{uploadProgress}</p>
                    <p className="text-blue-600 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      אנא המתן, זה עשוי לקחת מספר רגעים...
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500">אין מגבלת עמודים. תומך בעברית ובאנגלית.</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">או</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="topic">נושא השאלון - הדבקת טקסט (מהיר יותר)</Label>
              <Textarea
                id="topic"
                placeholder="לדוגמה: היסטוריה של ישראל, או הדבק טקסט כאן"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-32"
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numQuestions">מספר שאלות</Label>
              <Select value={numQuestions} onValueChange={setNumQuestions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 שאלות</SelectItem>
                  <SelectItem value="5">5 שאלות</SelectItem>
                  <SelectItem value="10">10 שאלות</SelectItem>
                  <SelectItem value="15">15 שאלות</SelectItem>
                  <SelectItem value="20">20 שאלות</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionType">סוג השאלות</Label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple">שאלות אמריקאיות</SelectItem>
                  <SelectItem value="open">שאלות פתוחות</SelectItem>
                  <SelectItem value="mixed">מעורב</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="language">שפה</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hebrew">עברית</SelectItem>
                  <SelectItem value="english">אנגלית</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || isUploading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                יוצר שאלות...
              </>
            ) : (
              <>
                <FileQuestion className="w-4 h-4 mr-2" />
                צור שאלון
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
