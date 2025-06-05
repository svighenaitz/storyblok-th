import React, { createContext, useContext, useState } from 'react';

interface SubmissionContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export const SubmissionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <SubmissionContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </SubmissionContext.Provider>
  );
};

// This is a custom hook that provides submission context
const useSubmission = () => {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error('useSubmission must be used within a SubmissionProvider');
  }
  return context;
};

export { useSubmission };
