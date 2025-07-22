import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import { Toaster } from "@/components/ui/toaster";
import { SummaryTableProvider } from '@/context/SummaryTableContext';

const Index = () => {
  const [activeFeature, setActiveFeature] = useState('dashboard');

  return (
    <SummaryTableProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-hebrew" dir="rtl">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
            <MainContent activeFeature={activeFeature} />
          </div>
        </SidebarProvider>
        <Toaster />
      </div>
    </SummaryTableProvider>
  );
};

export default Index;