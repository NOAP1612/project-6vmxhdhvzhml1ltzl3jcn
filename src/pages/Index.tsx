import { QuizGenerator } from "@/components/features/QuizGenerator";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-hebrew" dir="rtl">
      <main className="flex-1 p-6 sm:p-8 md:p-10">
        <QuizGenerator />
      </main>
      <Toaster />
    </div>
  );
};

export default Index;