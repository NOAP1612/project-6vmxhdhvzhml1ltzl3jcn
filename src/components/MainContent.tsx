import { Dashboard } from "./features/Dashboard";
import { QuizGenerator } from "./features/QuizGenerator";
import { SummaryTable } from "./features/SummaryTable";
import { StudySchedule } from "./features/StudySchedule";
import { StudyPost } from "./features/StudyPost";
import { Flashcards } from "./features/Flashcards";
import { FormulaSheet } from "./features/FormulaSheet";
import { TextToSpeech } from "./features/TextToSpeech";
import { ChartGenerator } from "./features/ChartGenerator";
import { PresentationGenerator } from "./features/PresentationGenerator";
import { BibliographyHelper } from "./features/BibliographyHelper";

interface MainContentProps {
  activeFeature: string;
}

export function MainContent({ activeFeature }: MainContentProps) {
  const renderFeature = () => {
    switch (activeFeature) {
      case 'dashboard':
        return <Dashboard />;
      case 'bibliography':
        return <BibliographyHelper />;
      case 'quiz':
        return <QuizGenerator />;
      case 'summary':
        return <SummaryTable />;
      case 'schedule':
        return <StudySchedule />;
      case 'post':
        return <StudyPost />;
      case 'flashcards':
        return <Flashcards />;
      case 'formulas':
        return <FormulaSheet />;
      case 'tts':
        return <TextToSpeech />;
      case 'charts':
        return <ChartGenerator />;
      case 'presentations':
        return <PresentationGenerator />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        {renderFeature()}
      </div>
    </main>
  );
}