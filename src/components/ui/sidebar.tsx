import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

interface SidebarContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebar();
  const isMobile = useMobile();

  return (
    <aside
      className={cn(
        "h-screen bg-card text-card-foreground border-l transition-all duration-300 ease-in-out flex flex-col",
        isMobile ? "fixed top-0 right-0 z-50 w-72" : "relative",
        isOpen ? "w-72 p-4" : "w-0 p-0 border-none",
        isMobile && !isOpen && "w-0 p-0 border-none"
      )}
    >
      {children}
    </aside>
  );
};

export const SidebarHeader = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebar();
  return <div className={cn("p-4", isOpen ? "block" : "hidden")}>{children}</div>;
};

export const SidebarContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebar();
  return <div className={cn("flex-1 overflow-y-auto", isOpen ? "block" : "hidden")}>{children}</div>;
};

export const SidebarFooter = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebar();
  return <div className={cn("p-4 mt-auto", isOpen ? "block" : "hidden")}>{children}</div>;
};

export const SidebarItem = ({ children, isActive, ...props }: { children: React.ReactNode; isActive?: boolean } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors",
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SidebarTrigger = () => {
  const { isOpen, setIsOpen } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 right-4 z-50 bg-card"
      onClick={() => setIsOpen(!isOpen)}
    >
      <ChevronLeft className={cn("h-6 w-6 transition-transform", isOpen && "rotate-180")} />
    </Button>
  );
};