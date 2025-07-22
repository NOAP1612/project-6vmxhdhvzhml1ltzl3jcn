import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Brain, 
  FileQuestion, 
  Table, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  Calculator,
  Volume2,
  Home,
  Settings
} from "lucide-react";

interface AppSidebarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
}

const menuItems = [
  {
    id: "dashboard",
    title: "לוח בקרה",
    icon: Home,
  },
  {
    id: "quiz",
    title: "יצירת שאלון",
    icon: FileQuestion,
  },
  {
    id: "summary",
    title: "טבלת סיכום",
    icon: Table,
  },
  {
    id: "schedule",
    title: "גאנט לימודים",
    icon: Calendar,
  },
  {
    id: "post",
    title: "פוסט לימודי",
    icon: MessageSquare,
  },
  {
    id: "flashcards",
    title: "כרטיסיות זיכרון",
    icon: CreditCard,
  },
  {
    id: "formulas",
    title: "דף נוסחאות",
    icon: Calculator,
  },
  {
    id: "tts",
    title: "קריאה בקול",
    icon: Volume2,
  },
];

export function AppSidebar({ activeFeature, setActiveFeature }: AppSidebarProps) {
  return (
    <Sidebar side="right" className="border-l border-border/40">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">פלטפורמת למידה</h2>
            <p className="text-sm text-gray-500">חכמה ומתקדמת</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium">כלי למידה</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeFeature === item.id}
                    className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <button 
                      onClick={() => setActiveFeature(item.id)}
                      className="flex items-center gap-3 w-full"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Settings className="w-4 h-4" />
          <span>מופעל על ידי OpenAI</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}