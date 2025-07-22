import { useQuizGenerator } from '@/hooks/useQuizGenerator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, FileUp, X, Wand2, Check, RefreshCw } from 'lucide-react';

export const QuizGenerator = () => {
  const {
    sourceText, setSourceText,
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
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">מחולל שאלונים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="source-text" className="font-semibold">הדבק טקסט או העלה קובץ PDF</Label>
            <Textarea
              id="source-text"
              placeholder="הזן כאן את הטקסט שלך..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="mt-1"
              rows={8}
              disabled={isUploading || !!fileName}
            />
          </div>
          <div className="flex items-center justify-between">
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading || !!sourceText} variant="outline">
              <FileUp className="ml-2 h-4 w-4" />
              העלה קובץ PDF
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
            {isUploading && <div className="text-sm text-gray-500 flex items-center"><Loader2 className="animate-spin ml-2" /> {uploadProgress}</div>}
            {fileName && !isUploading && (
              <div className="text-sm text-gray-500 flex items-center">
                <span>{fileName}</span>
                <Button variant="ghost" size="sm" onClick={handleReset}><X className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="question-count">מספר שאלות</Label>
            <Input
              id="question-count"
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              min="1"
              max="20"
              className="w-24 mt-1"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleGenerateQuiz} disabled={isLoading || (!sourceText && !fileName)}>
            {isLoading ? <Loader2 className="animate-spin ml-2" /> : <Wand2 className="ml-2 h-4 w-4" />}
            צור חידון
          </Button>
        </CardContent>
      </Card>

      {quizData && (
        <Card>
          <CardHeader>
            <CardTitle>{quizData.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {quizData.questions.map((q, index) => (
              <div key={index} className={`p-4 rounded-lg border ${q.isChecked ? (q.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-200'}`}>
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)} value={userAnswers[index] || ''} className="mt-2 space-y-2">
                  {q.options.map((option, i) => (
                    <div key={i} className="flex items-center">
                      <RadioGroupItem value={option} id={`q${index}-option${i}`} />
                      <Label htmlFor={`q${index}-option${i}`} className="mr-2">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <Button onClick={() => handleCheckAnswer(index)} size="sm" variant="outline" className="mt-4" disabled={!userAnswers[index]}>
                  <Check className="ml-2 h-4 w-4" />
                  בדוק תשובה
                </Button>
                {q.isChecked && !q.isCorrect && (
                  <p className="text-sm text-red-700 mt-2"><strong>הסבר:</strong> {q.explanation}</p>
                )}
              </div>
            ))}
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="ml-2 h-4 w-4" />
              התחל מחדש
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};