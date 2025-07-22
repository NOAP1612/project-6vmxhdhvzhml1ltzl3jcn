import React from 'react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { BookText, LayoutDashboard, Menu, X } from 'lucide-react';

interface NavItem {
  name: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
  { name: 'bibliography', label: 'עורך ביבליוגרפיה', icon: BookText },
];

interface AppSidebarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activeFeature, setActiveFeature }) => {
  const { isOpen, toggleSidebar } = useSidebar();

  const handleItemClick = (feature: string) => {
    setActiveFeature(feature);
    if (window.innerWidth < 768) { // Close sidebar on mobile after selection
      toggleSidebar();
    }
  };

  return (
    <>
      <div className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-40 w-64 md:relative md:translate-x-0 md:h-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">תפריט</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={activeFeature === item.name ? 'secondary' : 'ghost'}
              className="justify-start text-right w-full"
              onClick={() => handleItemClick(item.name)}
            >
              <item.icon className="ml-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 md:hidden z-50"
        onClick={toggleSidebar}
      >
        {isOpen ? null : <Menu />}
      </Button>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={toggleSidebar}></div>}
    </>
  );
};