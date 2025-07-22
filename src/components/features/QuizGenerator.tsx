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
// ... keep existing code
    setSourceText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (quizData) {
// ... keep existing code
    return (
      <QuizDisplay
        quizData={quizData}
        userAnswers={userAnswers}
        isSubmitted={isSubmitted}
        onAnswerChange={handleAnswerChange}
        onCheckAnswer={handleCheckAnswer} // Pass the new handler
        onReset={handleReset}
      />
    );
  }

  const questionAmountOptions = [...Array.from({ length: 11 }, (_, i) => i + 5), 20];

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in relative">
      {isUploading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-lg font-semibold text-gray-700">{uploadProgress || 'מעבד קובץ...'}</p>
          <p className="text-sm text-gray-500">זה עשוי לקחת מספר רגעים...</p>
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
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
