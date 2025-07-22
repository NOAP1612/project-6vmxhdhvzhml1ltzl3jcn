import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileQuestion, BarChart3, Table2 } from "lucide-react";

interface AppSidebarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
}

const SidebarButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className="w-full justify-start gap-2"
    onClick={onClick}
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </Button>
);

export function AppSidebar({ activeFeature, setActiveFeature }: AppSidebarProps) {
  const features = [
    { id: 'dashboard', label: 'לוח בקרה', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'quiz-generator', label: 'מחולל שאלונים', icon: <FileQuestion className="w-5 h-5" /> },
    { id: 'summary-table', label: 'טבלאות סיכום', icon: <Table2 className="w-5 h-5" /> },
    { id: 'chart-generator', label: 'מחולל תרשימים', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm p-4 border-l-2 border-gray-100 h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-6">
        <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
        <h2 className="text-xl font-bold text-gray-800">AI Studio</h2>
      </div>
      <div className="space-y-2">
        {features.map(feature => (
          <SidebarButton
            key={feature.id}
            icon={feature.icon}
            label={feature.label}
            isActive={activeFeature === feature.id}
            onClick={() => setActiveFeature(feature.id)}
          />
        ))}
      </div>
    </div>
  );
}