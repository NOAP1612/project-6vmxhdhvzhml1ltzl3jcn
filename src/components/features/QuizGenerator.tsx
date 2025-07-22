import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileQuestion, Loader2 } from "lucide-react";
import { useQuizGenerator } from "@/hooks/useQuizGenerator";
import { FileUpload } from "./FileUpload";
import { QuizDisplay } from "./QuizDisplay";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function QuizGenerator() {
  const {
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
  } = useQuizGenerator();

  const handleClearFile = () => {
    setSourceText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (quizData) {
    return (
      <QuizDisplay
        quizData={quizData}
        userAnswers={userAnswers}
        isSubmitted={isSubmitted}
        onAnswerChange={handleAnswerChange}
        onCheckAnswer={handleCheckAnswer}
        onReset={handleReset}
      />
    );
  }

  const questionAmountOptions = [...Array.from({ length: 11 }, (_, i) => i + 5), 20];

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in relative">
      {/* Enhanced Loading Overlay */}
      {(isUploading || isLoading) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 animate-scale-in">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin">
                  <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                </div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-800">
                  {isUploading ? 'מעלה קובץ...' : 'יוצר שאלון...'}
                </h3>
                <p className="text-gray-600">
                  {isUploading 
                    ? uploadProgress || 'מעבד את הקובץ שלך...'
                    : 'יוצר שאלות חכמות מהתוכן...'
                  }
                </p>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full animate-progress"></div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>זה עשוי לקחת מספר רגעים</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
          <FileQuestion className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mt-4">יצירת שאלון חכם</h1>
        <p className="text-lg text-gray-600 mt-2">העלה סיכום או הדבק טקסט, וקבל שאלון אינטראקטיבי תוך שניות</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>שלב 1: ספק את החומר</CardTitle>
          <CardDescription>
            העלה קובץ PDF או הדבק את הטקסט שממנו תרצה ליצור את השאלון.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            fileName={fileName}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onClearFile={handleClearFile}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">או</span>
            </div>
          </div>

          <Textarea
            placeholder="הדבק כאן את הטקסט שלך..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="h-48"
            disabled={isUploading || !!fileName}
          />

          <div className="space-y-2">
            <Label htmlFor="question-amount">מספר שאלות</Label>
            <Select
              value={String(questionCount)}
              onValueChange={(value) => setQuestionCount(Number(value))}
              disabled={isLoading}
              dir="rtl"
            >
              <SelectTrigger id="question-amount">
                <SelectValue placeholder="בחר מספר שאלות" />
              </SelectTrigger>
              <SelectContent>
                {questionAmountOptions.map((amount) => (
                  <SelectItem key={amount} value={String(amount)}>
                    {amount} שאלות
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerateQuiz} 
            disabled={isLoading || !sourceText.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                יוצר שאלון...
              </>
            ) : (
              "צור שאלון"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}