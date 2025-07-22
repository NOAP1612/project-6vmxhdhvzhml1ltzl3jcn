import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState('dashboard');

  return (
    <div className="min-h-screen font-hebrew" 
         style={{ background: 'linear-gradient(to bottom, #5BD383 0%, #29B366 100%)' }} 
         dir="rtl">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
          <MainContent activeFeature={activeFeature} />
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
};

export default Index;