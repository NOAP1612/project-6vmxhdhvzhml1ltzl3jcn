import { Sidebar, SidebarItem } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  BookOpenCheck,
  GraduationCap,
  ListOrdered,
} from "lucide-react";

interface AppSidebarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
}

export const AppSidebar = ({ activeFeature, setActiveFeature }: AppSidebarProps) => {
  const features = [
    { id: 'dashboard', name: 'דאשבורד', icon: <LayoutDashboard size={20} /> },
    { id: 'presentation', name: 'מצגות', icon: <FileText size={20} /> },
    { id: 'quiz', name: 'בחנים', icon: <MessageSquare size={20} /> },
    { id: 'charts', name: 'גרפים', icon: <BarChart3 size={20} /> },
    { id: 'summary', name: 'טבלאות סיכום', icon: <BookOpenCheck size={20} /> },
    { id: 'bibliography', name: 'עיצוב ביבליוגרפיה', icon: <ListOrdered size={20} /> },
  ];

  return (
    <Sidebar>
      <div className="flex items-center mb-8">
        <GraduationCap size={32} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800 mr-3">StudyAI</h1>
      </div>
      {features.map((feature) => (
        <SidebarItem
          key={feature.id}
          icon={feature.icon}
          isActive={activeFeature === feature.id}
          onClick={() => setActiveFeature(feature.id)}
        >
          {feature.name}
        </SidebarItem>
      ))}
    </Sidebar>
  );
};