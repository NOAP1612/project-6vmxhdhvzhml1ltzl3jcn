import { QuizGenerator } from "./features/QuizGenerator";
import { SummaryTableGenerator } from "./features/SummaryTableGenerator";
import { ChartGenerator } from "./features/ChartGenerator";

interface MainContentProps {
  activeFeature: string;
}

const Dashboard = () => (
    <div className="p-8 text-center">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            ברוכים הבאים ל-AI Studio
        </h1>
        <p className="text-gray-600 text-xl mt-4">הכלי שלך ליצירת תוכן חכם.</p>
        <p className="mt-2 text-gray-500">בחר כלי מהתפריט הימני כדי להתחיל במסע היצירה שלך.</p>
    </div>
);


export function MainContent({ activeFeature }: MainContentProps) {
  const renderFeature = () => {
    switch (activeFeature) {
      case 'quiz-generator':
        return <QuizGenerator />;
      case 'summary-table':
        return <SummaryTableGenerator />;
      case 'chart-generator':
        return <ChartGenerator />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="flex-1 p-6 sm:p-8 md:p-12 overflow-auto bg-gray-50/50">
      {renderFeature()}
    </main>
  );
}