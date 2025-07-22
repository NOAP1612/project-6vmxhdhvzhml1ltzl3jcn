import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Question {
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuestionItemProps {
  question: Question;
  index: number;
  showAnswer: boolean;
  toggleAnswer: (index: number) => void;
}

export const QuestionItem = ({ question, index, showAnswer, toggleAnswer }: QuestionItemProps) => {
  return (
    <div className="border rounded-lg p-6 space-y-4">
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
                showAnswer && option === question.correctAnswer
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>
                <span>{option}</span>
                {showAnswer && option === question.correctAnswer && (
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
          {showAnswer ? 'הסתר תשובה' : 'הצג תשובה'}
        </Button>
      </div>

      {showAnswer && (
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
  );
};