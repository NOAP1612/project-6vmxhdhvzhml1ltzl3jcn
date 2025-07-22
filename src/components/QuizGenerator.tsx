import { useQuizGenerator, QuizQuestion } from '@/hooks/useQuizGenerator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, FileText, Check, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const QuestionCard = ({
  question,
  index,
  userAnswer,
  handleAnswerChange,
  handleCheckAnswer,
  isSubmitted,
}: {
  question: QuizQuestion;
  index: number;
  userAnswer?: string;
  handleAnswerChange: (index: number, answer: string) => void;
  handleCheckAnswer: (index: number) => void;
  isSubmitted: boolean;
}) => {
  const getOptionClass = (option: string) => {
    if (!question.isChecked) return '';
    if (option === question.correctAnswer) return 'bg-green-100 border-green-400';
    if (option === userAnswer) return 'bg-red-100 border-red-400';
    return '';
  };

  return (
    <Card className={cn("transition-all", question.isChecked && question.isCorrect === true && "border-green-500", question.isChecked && question.isCorrect === false && "border-red-500")}>
      <CardHeader>
        <CardTitle>{index + 1}. {question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={userAnswer} onValueChange={(value) => handleAnswerChange(index, value)} disabled={question.isChecked}>
          {question.options.map((option, i) => (
            <div key={i} className={cn("flex items-center space-x-2 p-3 rounded-md border", getOptionClass(option))}>
              <RadioGroupItem value={option} id={`q${index}-o${i}`} />
              <Label htmlFor={`q${index}-o${i}`} className="flex-1">{option}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-4">
          {!question.isChecked ? (
            <Button onClick={() => handleCheckAnswer(index)} disabled={!userAnswer}>בדוק תשובה</Button>
          ) : (
            <div className={cn("p-3 rounded-md text-sm", question.isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800")}>
              {question.isCorrect ? 'כל הכבוד! תשובה נכונה.' : `תשובה שגויה. ${question.explanation}`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const QuizGenerator = () => {
  const {
    sourceText, setSourceText,
    fileName,
    isUploading,
    isLoading,
    quizData,
    userAnswers,
    isSubmitted,
    fileInputRef,
    handleFileChange,
    handleGenerateQuiz,
    handleAnswerChange,
    handleCheckAnswer,
    handleReset,
  } = useQuizGenerator();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">מחולל בחנים</h1>
        <p className="text-gray-600 mt-2">הפוך כל טקסט לחידון אינטראקטיבי לתרגול ולמידה.</p>
      </div>
      {!quizData && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Textarea
                placeholder="הדבק כאן את הטקסט שלך..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-[150px] text-base"
                disabled={isUploading || isLoading}
              />
              <div className="flex items-center justify-between">
                <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading || isLoading}>
                  <Upload className="ml-2 h-4 w-4" />
                  {isUploading ? 'מעלה...' : 'העלה קובץ PDF'}
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
                {fileName && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{fileName}</span>
                    <Button variant="ghost" size="icon" onClick={handleReset} disabled={isUploading || isLoading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={handleGenerateQuiz} disabled={isLoading || isUploading || !sourceText} size="lg">
                {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
                צור בוחן
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg font-semibold">יוצר את הבוחן שלך...</p>
          <p className="text-gray-500">זה עשוי לקחת מספר רגעים...</p>
        </div>
      )}
      {quizData && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{quizData.title}</h2>
            <Button onClick={handleReset} variant="outline" className="mt-4">
              <RefreshCw className="ml-2 h-4 w-4" />
              התחל מחדש
            </Button>
          </div>
          <div className="space-y-4">
            {quizData.questions.map((q, i) => (
              <QuestionCard
                key={i}
                index={i}
                question={q}
                userAnswer={userAnswers[i]}
                handleAnswerChange={handleAnswerChange}
                handleCheckAnswer={handleCheckAnswer}
                isSubmitted={isSubmitted}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};