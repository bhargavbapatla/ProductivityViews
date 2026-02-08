import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type ViewType = 'landing' | 'tree' | 'kanban';

interface ViewContextType {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');

  return (
    <ViewContext.Provider value={{ currentView, setView: setCurrentView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};
