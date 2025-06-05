import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./ContactForm.module.scss";
import { contactFormSchema } from "@/schemas/contactFormSchema";
import type { ContactFormData } from "@/schemas/contactFormSchema";
import FormErrorMessage from "./FormErrorMessage";

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void> | void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactFormSchema) as Resolver<ContactFormData>,
  });

  return (
    <div className={styles.container}>
      <form 
        data-testid="contact-form"
        className={styles.form} 
        onSubmit={handleSubmit(onSubmit)} 
        noValidate
      >
        <div className={styles.row}>
          <div className={styles.fieldGroup} style={{ flex: 1, position: "relative" }}>
            <label htmlFor="firstName" className={styles.inputLabel}>First name *</label>
            <input
              id="firstName"
              type="text"
              placeholder="First name *"
              className={styles.input}
              autoComplete="given-name"
              {...register("firstName")}
            />
            <FormErrorMessage error={errors.firstName} />
          </div>
          <div className={styles.fieldGroup} style={{ flex: 1, position: "relative" }}>
            <label htmlFor="lastName" className={styles.inputLabel}>Last name *</label>
            <input
              id="lastName"
              type="text"
              placeholder="Last name *"
              className={styles.input}
              autoComplete="family-name"
              {...register("lastName")}
            />
            <FormErrorMessage error={errors.lastName} />
          </div>
        </div>
        <div className={styles.fieldGroup} style={{ position: "relative" }}>
          <label htmlFor="email" className={styles.inputLabel}>Work Email *</label>
          <input
            id="email"
            type="email"
            placeholder="Work Email *"
            className={styles.input}
            autoComplete="email"
            {...register("email")}
          />
          <FormErrorMessage error={errors.email} />
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
          <FormErrorMessage error={errors.message} />
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
        {/* {(isSubmitted && !isSubmitSuccessful) && (
          <p className={styles.submitErrorMessage}>Something went wrong</p>
        )} */} 
        {/* // TODO: implement error message */}
      </form>
    </div>
  );
};

export default ContactForm;
