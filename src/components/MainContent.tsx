import React, { ReactNode } from 'react';

interface MainContentProps {
  activeFeature: string;
  children: ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ activeFeature, children }) => {
  return (
    <main className="flex-1 p-4 md:p-8">
      {activeFeature === 'dashboard' && (
        <div>
          <h1 className="text-3xl font-bold mb-4">ברוכים הבאים!</h1>
          <p className="text-lg text-gray-600">בחר כלי מהתפריט כדי להתחיל לעבוד.</p>
        </div>
      )}
      {children}
    </main>
  );
};