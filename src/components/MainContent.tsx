import { Dashboard } from '@/components/Dashboard';
import { PresentationGenerator } from '@/components/PresentationGenerator';
import { QuizGenerator } from '@/components/QuizGenerator';
import { ChartGenerator } from '@/components/ChartGenerator';
import { SummaryTable } from '@/components/SummaryTable';
import { BibliographyFormatter } from '@/components/BibliographyFormatter';

interface MainContentProps {
  activeFeature: string;
}

export const MainContent = ({ activeFeature }: MainContentProps) => {
  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
      {activeFeature === 'dashboard' && <Dashboard />}
      {activeFeature === 'presentation' && <PresentationGenerator />}
      {activeFeature === 'quiz' && <QuizGenerator />}
      {activeFeature === 'charts' && <ChartGenerator />}
      {activeFeature === 'summary' && <SummaryTable />}
      {activeFeature === 'bibliography' && <BibliographyFormatter />}
    </main>
  );
};