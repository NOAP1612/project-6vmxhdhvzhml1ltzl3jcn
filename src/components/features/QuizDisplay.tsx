import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, HelpCircle, RotateCw } from "lucide-react";
import type { QuizData, QuizQuestion } from "@/hooks/useQuizGenerator";

interface QuizDisplayProps {
  quizData: QuizData;
  userAnswers: Record<number, string>;
  isSubmitted: boolean;
  onAnswerChange: (questionIndex: number, answer: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

const getAlertVariant = (isSubmitted: boolean, isCorrect?: boolean) => {
  if (!isSubmitted) return "default";
  return isCorrect ? "success" : "destructive";
};

const getIcon = (isSubmitted: boolean, isCorrect?: boolean) => {
  if (!isSubmitted) return <HelpCircle className="h-4 w-4" />;
  return isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
};

export function QuizDisplay({
  quizData,
  userAnswers,
  isSubmitted,
  onAnswerChange,
  onSubmit,
  onReset,
}: QuizDisplayProps) {
  const score = quizData.questions.reduce((acc, q, i) => acc + (q.isCorrect ? 1 : 0), 0);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{quizData.title}</CardTitle>
            {isSubmitted && (
              <p className="text-lg font-bold mt-2 text-blue-600">
                הציון שלך: {score} / {quizData.questions.length}
              </p>
            )}
          </div>
          <Button onClick={onReset} variant="outline">
            <RotateCw className="w-4 h-4 mr-2" />
            התחל מחדש
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {quizData.questions.map((q, index) => (
          <Alert key={index} variant={getAlertVariant(isSubmitted, q.isCorrect)}>
            {getIcon(isSubmitted, q.isCorrect)}
            <AlertTitle className="font-bold">{index + 1}. {q.question}</AlertTitle>
            <AlertDescription>
              <RadioGroup
                value={userAnswers[index] || ""}
                onValueChange={(value) => onAnswerChange(index, value)}
                disabled={isSubmitted}
                className="mt-4 space-y-2"
              >
                {q.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                    <Label htmlFor={`q${index}-o${i}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              {isSubmitted && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
                  <p><strong>התשובה שלך:</strong> {q.userAnswer || "לא נענתה"}</p>
                  <p><strong>התשובה הנכונה:</strong> {q.correctAnswer}</p>
                  <p className="mt-2"><strong>הסבר:</strong> {q.explanation}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
      {!isSubmitted && (
        <CardFooter>
          <Button onClick={onSubmit} className="w-full">הגש שאלון</Button>
        </CardFooter>
      )}
    </Card>
  );
}