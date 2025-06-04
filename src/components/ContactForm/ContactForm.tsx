import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./ContactForm.module.scss";
import { contactFormSchema } from "@/schemas/contactFormSchema";
import type { ContactFormData } from "@/schemas/contactFormSchema";
import { submitContactForm } from "@/services/contactFormService";

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactForm(data);
      reset(); // Reset form on success
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.row}>
          <div className={styles.fieldGroup} style={{ flex: 1, position: "relative" }}>
            <label htmlFor="firstName" className={styles.inputLabel}>First name *</label>
            <input
              type="text"
              placeholder="First name *"
              className={styles.input}
              autoComplete="given-name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <span className={styles.errorMessage}>{errors.firstName.message}</span>
            )}
          </div>
          <div className={styles.fieldGroup} style={{ flex: 1, position: "relative" }}>
          <label htmlFor="lastName" className={styles.inputLabel}>Last name *</label>
            <input
              type="text"
              placeholder="Last name *"
              className={styles.input}
              autoComplete="family-name"
              {...register("lastName")}
            />
            {errors.lastName && (
              <span className={styles.errorMessage}>{errors.lastName.message}</span>
            )}
          </div>
        </div>
        <div className={styles.fieldGroup} style={{ position: "relative" }}>
          <label htmlFor="email" className={styles.inputLabel}>Work Email *</label>
          <input
            type="email"
            placeholder="Work Email *"
            className={styles.input}
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email.message}</span>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="message">
            Message *
          </label>
          <textarea
            id="message"
            placeholder="Enter your message"
            className={styles.textarea}
            {...register("message")}
          />
          {errors.message && (
            <span className={styles.errorMessage}>{errors.message.message}</span>
          )}
        </div>
        <p className={styles.privacyText}>
          For information about our privacy practices and commitment to protecting your privacy, please review our{' '}
          <a 
            href="https://example.com/privacy-policy" 
            className={styles.privacyLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>.
        </p>
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        {isSubmitSuccessful && (
          <p className={styles.successMessage}>Thank you for your message!</p>
        )}        
      </form>
    </div>
  );
};

export default ContactForm;
