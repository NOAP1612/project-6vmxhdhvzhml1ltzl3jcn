import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, RotateCw, Lightbulb } from "lucide-react";
import type { QuizData } from "@/hooks/useQuizGenerator";

interface QuizDisplayProps {
// ... keep existing code (interface definition)
  quizData: QuizData;
  userAnswers: Record<number, string>;
  isSubmitted: boolean;
  onAnswerChange: (questionIndex: number, answer: string) => void;
  onCheckAnswer: (questionIndex: number) => void;
  onReset: () => void;
}

const getOptionClassName = (
// ... keep existing code (function implementation)
  option: string,
  q: QuizData['questions'][0]
) => {
  if (!q.isChecked) return "";
  const isSelected = q.userAnswer === option;
  const isCorrect = q.correctAnswer === option;

  if (isCorrect) return "bg-green-100 border-green-300 text-green-900";
  if (isSelected && !isCorrect) return "bg-red-100 border-red-300 text-red-900";
  return "text-gray-600";
};

const formatQuestion = (question: string) => {
  const cleanedQuestion = question.trim().replace(/\?$/g, '');
  return `${cleanedQuestion}?`;
};

export function QuizDisplay({
// ... keep existing code (function signature)
  quizData,
  userAnswers,
  isSubmitted,
  onAnswerChange,
  onCheckAnswer,
  onReset,
}: QuizDisplayProps) {
  const score = quizData.questions.filter(q => q.isCorrect).length;
  const allQuestionsChecked = quizData.questions.every(q => q.isChecked);

  return (
    <Card className="animate-fade-in" dir="rtl">
      <CardHeader>
// ... keep existing code (CardHeader content)
      </CardHeader>
      <CardContent className="space-y-6">
        {quizData.questions.map((q, index) => (
          <Alert key={index} variant="outline" className="p-5">
            <div className="flex items-start">
                {q.isChecked ? (
                    q.isCorrect ? <CheckCircle className="h-5 w-5 text-green-500 mt-1" /> : <XCircle className="h-5 w-5 text-red-500 mt-1" />
                ) : (
                    <div className="h-5 w-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 mt-1">{index + 1}</div>
                )}
                <div className="mr-4 w-full">
                    <AlertTitle className="font-bold text-lg mb-4 text-right">{formatQuestion(q.question)}</AlertTitle>
                    <AlertDescription>
                    <RadioGroup
// ... keep existing code (RadioGroup props)
                    >
                        {q.options.map((option, i) => (
                        <div key={i} className={`flex items-center space-x-2 rounded-md border p-3 transition-all ${getOptionClassName(option, q)}`}>
                            <RadioGroupItem value={option} id={`q${index}-o${i}`} className="ml-2" />
                            <Label htmlFor={`q${index}-o${i}`} className="flex-1 cursor-pointer text-right">{option}</Label>
                        </div>
                        ))}
                    </RadioGroup>
                    {!q.isChecked && (
// ... keep existing code (check answer button)
                    )}
                    {q.isChecked && (
// ... keep existing code (explanation block)
                    )}
                    </AlertDescription>
                </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
