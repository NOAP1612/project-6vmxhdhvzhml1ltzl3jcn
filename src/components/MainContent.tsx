import { Dashboard } from './Dashboard';
import { QuizGenerator } from './QuizGenerator';
import { SummaryTable } from './SummaryTable';
import { ChartGenerator } from './ChartGenerator';

interface MainContentProps {
  activeFeature: string;
}

export const MainContent = ({ activeFeature }: MainContentProps) => {
  const renderFeature = () => {
    switch (activeFeature) {
      case 'dashboard':
        return <Dashboard />;
      case 'quiz':
        return <QuizGenerator />;
      case 'summary':
        return <SummaryTable />;
      case 'charts':
        return <ChartGenerator />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="flex-1 bg-white overflow-y-auto">
      {renderFeature()}
    </main>
  );
};