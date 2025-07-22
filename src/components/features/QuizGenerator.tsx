import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileQuestion, Loader2, CheckCircle, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createQuizQuestions } from "@/functions";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";

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
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

    try {
      toast({
        title: "מעלה קובץ...",
        description: "שלב 1 מתוך 2: מעלה את הקובץ לשרת.",
      });
      const { file_url } = await uploadFile({ file: selectedFile });

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

      const result = await extractDataFromUploadedFile({
        file_url,
        json_schema: schema,
      });

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
        const content = (result.output as { text_content: string }).text_content;
        setTopic(content);
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
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        description = "אירעה שגיאת רשת בעת עיבוד הקובץ. אנא בדוק את חיבור האינטרנט שלך ונסה שוב. אם הבעיה נמשכת, ייתכן שיש בעיה זמנית בשרת.";
      } else if (error instanceof Error) {
        description = `אירעה שגיאה: ${error.message}`;
      }
      
      toast({
        title: "שגיאה בעיבוד הקובץ",
        description: description,
        variant: "destructive",
      });
      setFileName('');
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
                <Upload className="w-5 h-5" />
                <span>{isUploading ? 'מעבד קובץ...' : (fileName || 'לחץ לבחירת קובץ PDF')}</span>
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
              <Label htmlFor="topic">נושא השאלון (או הטקסט שחולץ)</Label>
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

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>השאלון שנוצר</CardTitle>
            <CardDescription>
              {questions.length} שאלות בנושא "{topic}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    שאלה {index + 1}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    question.type === 'multiple' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {question.type === 'multiple' ? 'אמריקאית' : 'פתוחה'}
                  </span>
                </div>
                
                <p className="text-gray-800 leading-relaxed">{question.question}</p>
                
                {question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          showAnswers[index] && option === question.correctAnswer
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span>{option}</span>
                          {showAnswers[index] && option === question.correctAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-600 mr-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAnswer(index)}
                  >
                    {showAnswers[index] ? 'הסתר תשובה' : 'הצג תשובה'}
                  </Button>
                </div>
                
                {showAnswers[index] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">תשובה נכונה:</span>
                    </div>
                    <p className="text-gray-800">{question.correctAnswer}</p>
                    {question.explanation && (
                      <>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="font-semibold text-gray-900">הסבר:</span>
                        </div>
                        <p className="text-gray-700">{question.explanation}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
