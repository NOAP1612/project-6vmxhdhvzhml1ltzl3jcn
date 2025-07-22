import { Sidebar, SidebarHeader, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, Table, BarChart3, BrainCircuit } from "lucide-react";

interface AppSidebarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
}

export const AppSidebar = ({ activeFeature, setActiveFeature }: AppSidebarProps) => {
  const features = [
    { id: 'dashboard', name: 'לוח בקרה', icon: LayoutDashboard },
    { id: 'quiz', name: 'מחולל בחנים', icon: FileText },
    { id: 'summary', name: 'טבלאות סיכום', icon: Table },
    { id: 'charts', name: 'יצירת גרפים', icon: BarChart3 },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">כלי למידה AI</h1>
        </div>
      </SidebarHeader>
      <div className="flex flex-col gap-2 mt-8">
        {features.map((feature) => (
          <SidebarLink
            key={feature.id}
            icon={feature.icon}
            onClick={() => setActiveFeature(feature.id)}
            isActive={activeFeature === feature.id}
          >
            {feature.name}
          </SidebarLink>
        ))}
      </div>
    </Sidebar>
  );
};