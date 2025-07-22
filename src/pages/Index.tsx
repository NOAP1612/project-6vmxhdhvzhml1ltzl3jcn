import { useState } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-hebrew" dir="rtl">
      <div className="flex min-h-screen w-full">
        <AppSidebar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
        <MainContent activeFeature={activeFeature} />
      </div>
    </div>
  );
};

export default Index;