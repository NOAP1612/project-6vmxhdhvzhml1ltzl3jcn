import { useQuizGenerator } from '@/hooks/useQuizGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Upload, FileText, X, Wand2, Check, AlertTriangle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export const QuizGenerator = () => {
  const {
    fileName,
    isUploading,
    uploadProgress,
    isLoading,
    quizData,
    userAnswers,
    questionCount,
    setQuestionCount,
    fileInputRef,
    handleFileChange,
    handleGenerateQuiz,
    handleAnswerChange,
    handleCheckAnswer,
    handleReset,
  } = useQuizGenerator();

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">יצירת בחנים</h1>
        <p className="text-lg text-gray-600 mt-2">העלה חומר לימוד וקבל בחן אמריקאי באופן אוטומטי.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>1. העלאת חומר לימוד</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline">
              <Upload className="ml-2 h-4 w-4" />
              בחר קובץ
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.txt"
            />
            {fileName && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                <FileText className="h-5 w-5 text-gray-500" />
                <span>{fileName}</span>
                <Button onClick={handleReset} variant="ghost" size="icon" className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {isUploading && (
            <div className="flex items-center text-sm text-blue-600">
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              <span>{uploadProgress}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="question-count">מספר שאלות</Label>
            <Input
              id="question-count"
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              min="5"
              max="20"
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={handleGenerateQuiz} disabled={isLoading || isUploading || !fileName} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              יוצר בחן...
            </>
          ) : (
            <>
              <Wand2 className="ml-2 h-5 w-5" />
              צור בחן
            </>
          )}
        </Button>
      </div>

      {quizData && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">{quizData.title}</h2>
          {quizData.questions.map((q, index) => (
            <Card key={index} className={q.isChecked ? (q.isCorrect ? 'border-green-500' : 'border-red-500') : ''}>
              <CardHeader>
                <CardTitle>{index + 1}. {q.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={userAnswers[index]}
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  disabled={q.isChecked}
                >
                  {q.options.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                      <Label htmlFor={`q${index}-o${i}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex flex-col items-start space-y-4">
                <Button onClick={() => handleCheckAnswer(index)} disabled={q.isChecked || !userAnswers[index]}>
                  בדוק תשובה
                </Button>
                {q.isChecked && (
                  <div className={`flex items-center p-3 rounded-md w-full ${q.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {q.isCorrect ? <Check className="ml-2 h-5 w-5" /> : <AlertTriangle className="ml-2 h-5 w-5" />}
                    <div>
                      <p className="font-bold">{q.isCorrect ? 'תשובה נכונה!' : 'תשובה שגויה.'}</p>
                      <p>{q.explanation}</p>
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};