import { QuizGenerator } from "@/components/features/QuizGenerator";
import { ChartGenerator } from "@/components/features/ChartGenerator";
import { SummaryTable } from "@/components/features/SummaryTable";
import { TextToSpeech } from "@/components/features/TextToSpeech";
import { Dashboard } from "@/components/features/Dashboard";

interface MainContentProps {
  activeFeature: string;
}

export function MainContent({ activeFeature }: MainContentProps) {
  const renderFeature = () => {
    switch (activeFeature) {
      case 'dashboard':
        return <Dashboard />;
      case 'quiz':
        return <QuizGenerator />;
      case 'charts':
        return <ChartGenerator />;
      case 'summary':
        return <SummaryTable />;
      case 'tts':
        return <TextToSpeech />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="flex-1 p-6 sm:p-8 md:p-10">
      <div className="max-w-7xl mx-auto">
        {renderFeature()}
      </div>
    </main>
  );
}