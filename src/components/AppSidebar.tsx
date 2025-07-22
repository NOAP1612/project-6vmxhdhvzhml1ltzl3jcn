import {
  LayoutDashboard,
  FileQuestion,
  Table,
  Calendar,
  PenSquare,
  Layers,
  Sigma,
  Volume2,
  BarChart3,
  Presentation,
  Menu,
  X,
  BookText, // Added for Bibliography
} from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar"; // Changed back
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
}

const mainFeatures = [
  { name: "לוח בקרה", icon: LayoutDashboard, id: "dashboard" },
  { name: "עורך ביבליוגרפיה", icon: BookText, id: "bibliography" }, // Added
  { name: "יצירת מבחן", icon: FileQuestion, id: "quiz" },
  { name: "טבלת סיכום", icon: Table, id: "summary" },
  { name: "יצירת פוסט לימודי", icon: PenSquare, id: "post" },
  { name: "יצירת כרטיסיות", icon: Layers, id: "flashcards" },
  { name: "יצירת דף נוסחאות", icon: Sigma, id: "formulas" },
  { name: "הקראת טקסט", icon: Volume2, id: "tts" },
  { name: "יצירת גרפים", icon: BarChart3, id: "charts" },
  { name: "יצירת מצגות", icon: Presentation, id: "presentations" },
];

const secondaryFeatures = [
  { name: "לוח זמנים", icon: Calendar, id: "schedule" },
];

export function AppSidebar({ activeFeature, setActiveFeature }: AppSidebarProps) {
  const { isOpen, toggleSidebar } = useSidebar();

  const NavItem = ({ feature, isMobile = false }: { feature: typeof mainFeatures[0], isMobile?: boolean }) => (
    <button
      onClick={() => {
        setActiveFeature(feature.id);
        if (isMobile) toggleSidebar();
      }}
      className={cn(
        "flex items-center p-2 rounded-lg transition-colors w-full text-right",
        activeFeature === feature.id
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      <feature.icon className="h-5 w-5 ml-3" />
      <span>{feature.name}</span>
    </button>
  );

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">EduGen</h1>
        {isMobile && (
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-800">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">כלים עיקריים</p>
        {mainFeatures.map((feature) => (
          <NavItem key={feature.id} feature={feature} isMobile={isMobile} />
        ))}
        <p className="px-2 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">כלים נוספים</p>
        {secondaryFeatures.map((feature) => (
          <NavItem key={feature.id} feature={feature} isMobile={isMobile} />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-l border-gray-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <button onClick={toggleSidebar} className="fixed top-4 right-4 z-20 p-2 bg-white rounded-full shadow-md">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <div
          className={cn(
            "fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={toggleSidebar}
        />
        <div
          className={cn(
            "fixed top-0 right-0 h-full w-64 bg-white z-40 shadow-lg transform transition-transform",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <SidebarContent isMobile />
        </div>
      </div>
    </>
  );
}