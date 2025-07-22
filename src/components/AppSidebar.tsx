import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
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
    <Sidebar side="right">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <BrainCircuit className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">כלי למידה AI</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {features.map((feature) => (
            <SidebarMenuItem key={feature.id}>
              <SidebarMenuButton
                onClick={() => setActiveFeature(feature.id)}
                isActive={activeFeature === feature.id}
                className="w-full justify-start"
              >
                <feature.icon className="ml-2 h-5 w-5" />
                <span>{feature.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};