import React from 'react';
import { useQuizGenerator } from '@/hooks/useQuizGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Upload, X, Wand2, Check, RefreshCw } from 'lucide-react';

export const QuizGenerator = () => {
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

  const getScore = () => {
    if (!quizData) return 0;
    return quizData.questions.filter(q => q.isCorrect).length;
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto" dir="rtl">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">מחולל בחנים אוטומטי</CardTitle>
        </CardHeader>
        <CardContent>
          {!quizData ? (
            <div className="grid gap-6">
              <Textarea
                placeholder="הדבק כאן את חומר הלימוד או העלה קובץ PDF..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="w-full p-2 border rounded"
                rows={10}
              />
              <div className="flex items-center gap-4">
                <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  <Upload className="ml-2 h-4 w-4" />
                  {isUploading ? 'מעלה...' : 'העלה PDF'}
                </Button>
                <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
                {fileName && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>{fileName}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleReset()}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {isUploading && <p className="text-sm text-blue-600">{uploadProgress}</p>}
              <div className="flex items-center gap-2">
                <Label htmlFor="question-count">מספר שאלות:</Label>
                <Input
                  id="question-count"
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-20"
                  min="1"
                  max="20"
                />
              </div>
              <Button onClick={handleGenerateQuiz} disabled={isLoading || !sourceText}>
                {isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Wand2 className="ml-2 h-4 w-4" />}
                {isLoading ? 'יוצר בוחן...' : 'צור בוחן'}
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{quizData.title}</h2>
                {isSubmitted && (
                  <div className="text-lg font-bold">
                    ציון: {getScore()} / {quizData.questions.length}
                  </div>
                )}
              </div>
              <div className="space-y-6">
                {quizData.questions.map((q, index) => (
                  <Card key={index} className={`p-4 ${q.isChecked ? (q.isCorrect ? 'border-green-500' : 'border-red-500') : ''}`}>
                    <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                    <RadioGroup
                      value={userAnswers[index]}
                      onValueChange={(value) => handleAnswerChange(index, value)}
                      disabled={q.isChecked}
                    >
                      {q.options.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                          <Label htmlFor={`q${index}-o${i}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {!q.isChecked && (
                      <Button size="sm" onClick={() => handleCheckAnswer(index)} className="mt-2">
                        <Check className="ml-2 h-4 w-4" />
                        בדיקה
                      </Button>
                    )}
                    {q.isChecked && (
                      <div className={`mt-2 text-sm p-2 rounded ${q.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {q.isCorrect ? 'תשובה נכונה!' : `תשובה לא נכונה. ${q.explanation}`}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <Button onClick={handleReset}>
                  <RefreshCw className="ml-2 h-4 w-4" />
                  התחל מחדש
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};