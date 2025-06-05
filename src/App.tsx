import { useState } from 'react';
import styles from './App.module.scss';
import ContactForm from "./components/ContactForm/ContactForm";
import SubmissionsTable from "./components/SubmissionsTable/SubmissionsTable";
import type { ContactFormData } from './schemas/contactFormSchema';
import { submitContactForm } from './services/contactFormService';
import { SubmissionProvider } from './contexts/SubmissionContext';

function App() {
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactForm(data);      
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  return (
    <SubmissionProvider>
      <div className={styles.appContainer}>
        <div className={styles.centeredFormParent}>
          <ContactForm onSubmit={onSubmit} />
        </div>
        
        {/* Sticky bottom bar */}
        <button 
          type="button" 
          className={styles.stickyBar} 
          onClick={toggleDrawer}
          onKeyDown={(e) => e.key === 'Enter' && toggleDrawer()}
          aria-expanded={showDrawer}
          aria-controls="submissions-drawer"
        >
          <div className={styles.barContent}>
            <span>View Submissions</span>
            <span 
              className={`${styles.arrowIcon} ${showDrawer ? styles.up : styles.down}`}
              aria-hidden="true"
            >
              ▼
            </span>
          </div>
        </button>
        
        {/* Drawer */}
        <div 
          id="submissions-drawer" 
          className={`${styles.drawer} ${showDrawer ? styles.open : ''}`}
          role="region"
          aria-labelledby="submissions-drawer-label"
        >
          <div className={styles.drawerContent}>
            <h2 id="submissions-drawer-label">Submissions</h2>
            <SubmissionsTable />
          </div>
        </div>
        
        {/* Overlay */}
        {showDrawer && (
          <div 
            className={styles.overlay} 
            onClick={toggleDrawer}
            onKeyDown={(e) => e.key === 'Escape' && toggleDrawer()}
            role="button"
            tabIndex={0}
            aria-label="Close submissions drawer"
          />
        )}
      </div>
    </SubmissionProvider>
  );
}

export default App
