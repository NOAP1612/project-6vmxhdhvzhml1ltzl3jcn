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
import { BibliographyHelper } from "./BibliographyHelper"; // Added

interface MainContentProps {
  activeFeature: string;
}

export function MainContent({ activeFeature }: MainContentProps) {
  const renderFeature = () => {
    switch (activeFeature) {
      case 'dashboard':
        return <Dashboard />;
      case 'bibliography': // Added
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
    <main className="flex-1 p-6 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {renderFeature()}
      </div>
    </main>
  );
}