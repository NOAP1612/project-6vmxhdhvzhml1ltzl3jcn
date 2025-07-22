import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  type: 'multiple' | 'open';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface InteractiveQuizProps {
  questions: Question[];
  onReset: () => void;
}

export function InteractiveQuiz({ questions, onReset }: InteractiveQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleShowResult = (questionId: string) => {
    setShowResults(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleSubmitQuiz = () => {
    const newShowResults: Record<string, boolean> = {};
    questions.forEach(q => {
      newShowResults[q.id] = true;
    });
    setShowResults(newShowResults);
    setQuizCompleted(true);
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: questions.length };
  };

  const isAnswerCorrect = (questionId: string) => {
    return selectedAnswers[questionId] === questions.find(q => q.id === questionId)?.correctAnswer;
  };

  const allQuestionsAnswered = questions.every(q => selectedAnswers[q.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">השאלון האינטראקטיבי</h2>
          <p className="text-gray-600">{questions.length} שאלות</p>
        </div>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          צור שאלון חדש
        </Button>
      </div>

      {quizCompleted && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">השאלון הושלם!</h3>
              <p className="text-green-700">
                קיבלת {getScore().correct} מתוך {getScore().total} תשובות נכונות
                ({Math.round((getScore().correct / getScore().total) * 100)}%)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    שאלה {index + 1}
                  </CardTitle>
                  <CardDescription className="mt-2 text-base text-gray-800">
                    {question.question}
                  </CardDescription>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  question.type === 'multiple' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                )}>
                  {question.type === 'multiple' ? 'אמריקאית' : 'פתוחה'}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {question.type === 'multiple' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswers[question.id] === option;
                    const isCorrect = option === question.correctAnswer;
                    const showingResult = showResults[question.id];
                    
                    return (
                      <button
                        key={optionIndex}
                        onClick={() => !showingResult && handleAnswerSelect(question.id, option)}
                        disabled={showingResult}
                        className={cn(
                          "w-full p-4 text-right rounded-lg border-2 transition-all duration-200",
                          "hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
                          !showingResult && "cursor-pointer",
                          showingResult && "cursor-default",
                          isSelected && !showingResult && "border-blue-500 bg-blue-50",
                          showingResult && isCorrect && "border-green-500 bg-green-50",
                          showingResult && isSelected && !isCorrect && "border-red-500 bg-red-50",
                          !isSelected && !showingResult && "border-gray-200 bg-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-600 min-w-[24px]">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span className="flex-1">{option}</span>
                          {showingResult && isCorrect && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {showingResult && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {question.type === 'open' && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>תשובה מומלצת:</strong> {question.correctAnswer}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {question.type === 'multiple' && selectedAnswers[question.id] && !showResults[question.id] && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowResult(question.id)}
                  >
                    בדוק תשובה
                  </Button>
                )}
              </div>

              {showResults[question.id] && (
                <div className={cn(
                  "p-4 rounded-lg border",
                  isAnswerCorrect(question.id) 
                    ? "bg-green-50 border-green-200" 
                    : "bg-blue-50 border-blue-200"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    {isAnswerCorrect(question.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-semibold">
                      {isAnswerCorrect(question.id) ? 'תשובה נכונה!' : 'תשובה שגויה'}
                    </span>
                  </div>
                  
                  {!isAnswerCorrect(question.id) && (
                    <p className="text-gray-800 mb-2">
                      <strong>התשובה הנכונה:</strong> {question.correctAnswer}
                    </p>
                  )}
                  
                  {question.explanation && (
                    <div>
                      <strong>הסבר:</strong>
                      <p className="text-gray-700 mt-1">{question.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!quizCompleted && allQuestionsAnswered && (
        <div className="text-center">
          <Button 
            onClick={handleSubmitQuiz}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            size="lg"
          >
            סיים שאלון וראה תוצאות
          </Button>
        </div>
      )}
    </div>
  );
}