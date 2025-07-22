import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import { Toaster } from "@/components/ui/toaster";
import { BibliographyHelper } from '@/components/BibliographyHelper';

const Index = () => {
  const [activeFeature, setActiveFeature] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-hebrew" dir="rtl">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
          <MainContent activeFeature={activeFeature}>
            {activeFeature === 'bibliography' && (
              <div className="p-4">
                <BibliographyHelper />
              </div>
            )}
          </MainContent>
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
};

export default Index;