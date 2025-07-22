import { useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarTrigger, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, FileText, MessageSquare, BarChart, BookOpenCheck, ListOrdered, Settings, Menu } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { PresentationGenerator } from "@/components/PresentationGenerator";
import { QuizGenerator } from "@/components/QuizGenerator";
import { ChartGenerator } from "@/components/ChartGenerator";
import { SummaryTable } from "@/components/SummaryTable";
import { BibliographyFormatter } from "@/components/BibliographyFormatter";

const menuItems = [
  { id: "dashboard", title: "ראשי", icon: Home },
  { id: "presentations", title: "מצגות", icon: FileText },
  { id: "quizzes", title: "בחנים", icon: MessageSquare },
  { id: "charts", title: "גרפים", icon: BarChart },
  { id: "summary-tables", title: "טבלאות סיכום", icon: BookOpenCheck },
  { id: "bibliography", title: "עיצוב ביבליוגרפיה", icon: ListOrdered },
];

const Index = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "presentations":
        return <PresentationGenerator />;
      case "quizzes":
        return <QuizGenerator />;
      case "charts":
        return <ChartGenerator />;
      case "summary-tables":
        return <SummaryTable />;
      case "bibliography":
        return <BibliographyFormatter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen bg-gray-50">
      <Sidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} side="right">
        <SidebarContent className="bg-white shadow-md">
          <SidebarHeader className="border-b p-4">
            <h2 className="text-xl font-semibold">StudyAI</h2>
          </SidebarHeader>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <Button
                  variant={activeComponent === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveComponent(item.id)}
                >
                  <item.icon className="ml-2 h-5 w-5" />
                  <span>{item.title}</span>
                </Button>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300" style={{ marginRight: isSidebarOpen ? '250px' : '0' }}>
        <header className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            {menuItems.find(item => item.id === activeComponent)?.title}
          </h1>
          <div />
        </header>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};

export default Index;