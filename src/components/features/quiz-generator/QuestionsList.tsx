import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionItem } from "./QuestionItem";

interface Question {
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation:string;
}

interface QuestionsListProps {
  questions: Question[];
  topic: string;
  showAnswers: boolean[];
  toggleAnswer: (index: number) => void;
}

export const QuestionsList = ({ questions, topic, showAnswers, toggleAnswer }: QuestionsListProps) => {
  if (questions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>השאלון שנוצר</CardTitle>
        <CardDescription>
          {questions.length} שאלות בנושא "{topic}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, index) => (
          <QuestionItem
            key={index}
            question={question}
            index={index}
            showAnswer={showAnswers[index]}
            toggleAnswer={toggleAnswer}
          />
        ))}
      </CardContent>
    </Card>
  );
};