import { FileText, FileQuestion } from "lucide-react";

// This is a placeholder for the real Sidebar component.
// I'm assuming a structure based on common sidebar implementations.
const SidebarItem = ({ icon, text, active, onClick }: { icon: React.ReactNode, text: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-right text-base font-medium rounded-lg transition-colors duration-200 ${
            active
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
    >
        {icon}
        <span className="mr-4">{text}</span>
    </button>
);

const Sidebar = ({ children }: { children: React.ReactNode }) => (
    <aside className="w-64 bg-white border-l border-gray-200 p-4 flex flex-col gap-2">
        <div className="font-bold text-xl p-2 mb-4">תפריט כלים</div>
        {children}
    </aside>
);


interface AppSidebarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
}

export function AppSidebar({ activeFeature, setActiveFeature }: AppSidebarProps) {
  return (
    <Sidebar>
        <SidebarItem
          icon={<FileText className="h-5 w-5" />}
          text="יצירת טבלת סיכום"
          active={activeFeature === 'summary-table'}
          onClick={() => setActiveFeature('summary-table')}
        />
        <SidebarItem
          icon={<FileQuestion className="h-5 w-5" />}
          text="יצירת שאלון"
          active={activeFeature === 'quiz-generator'}
          onClick={() => setActiveFeature('quiz-generator')}
        />
    </Sidebar>
  );
}