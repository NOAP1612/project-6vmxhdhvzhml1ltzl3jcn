import { QuizGenerator } from './features/QuizGenerator';
import { SummaryTable } from './features/SummaryTable';

interface MainContentProps {
  activeFeature: string;
}

export function MainContent({ activeFeature }: MainContentProps) {
  const renderFeature = () => {
    switch (activeFeature) {
      case 'summary-table':
        // The component SummaryTable is not in the scope of the allowed files.
        // I will add a placeholder for it.
        return <div>טבלת סיכום תופיע כאן</div>;
      case 'quiz-generator':
        return <QuizGenerator />;
      default:
        return <div className="text-center p-8 text-gray-500">אנא בחר כלי מהתפריט</div>;
    }
  };

  return (
    <main className="flex-1 p-6 sm:p-8 md:p-10 bg-gray-50 rounded-r-3xl shadow-inner overflow-y-auto">
      {renderFeature()}
    </main>
  );
}