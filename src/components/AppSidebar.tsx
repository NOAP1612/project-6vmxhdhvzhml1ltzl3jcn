import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, FileQuestion, BarChart3, FileText, Settings, LifeBuoy, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMobile } from "@/hooks/use-mobile";

interface AppSidebarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
}

export function AppSidebar({ activeFeature, setActiveFeature }: AppSidebarProps) {
  const isMobile = useMobile();

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'ראשי' },
    { id: 'quiz', icon: FileQuestion, label: 'יצירת שאלונים' },
    { id: 'charts', icon: BarChart3, label: 'יצירת גרפים' },
    { id: 'summary', icon: FileText, label: 'טבלת סיכום' },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight">שם המשתמש</span>
            <span className="text-sm text-muted-foreground">user@email.com</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            isActive={activeFeature === item.id}
            onClick={() => setActiveFeature(item.id)}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </SidebarItem>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarItem>
          <LifeBuoy className="w-5 h-5" />
          תמיכה
        </SidebarItem>
        <SidebarItem>
          <Settings className="w-5 h-5" />
          הגדרות
        </SidebarItem>
        <SidebarItem>
          <LogOut className="w-5 h-5" />
          התנתק
        </SidebarItem>
      </SidebarFooter>
      {isMobile && <SidebarTrigger />}
    </Sidebar>
  );
}