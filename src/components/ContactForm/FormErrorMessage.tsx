import React from 'react';
import type { FieldError } from 'react-hook-form';
import styles from './ContactForm.module.scss';

interface FormErrorMessageProps {
  error?: FieldError;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <span className={styles.errorMessage} role="alert">
      {error.message}
    </span>
  );
};

export default FormErrorMessage;
