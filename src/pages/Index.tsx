import { useState } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState('quiz-generator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-hebrew" dir="rtl">
      <div className="flex min-h-screen w-full">
        <AppSidebar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
        <MainContent activeFeature={activeFeature} />
      </div>
      <Toaster />
    </div>
  );
};

export default Index;