import styles from './App.module.scss'
import ContactForm from "./components/ContactForm/ContactForm";
import type { ContactFormData } from './schemas/contactFormSchema';
import { submitContactForm } from './services/contactFormService';

function App() {

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactForm(data);      
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  return (
    <div className={styles.centeredFormParent}>
      <ContactForm onSubmit={onSubmit}/>
    </div>
  )
}

export default App
