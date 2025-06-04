import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./ContactForm.module.scss";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  message: yup.string().required("Message is required"),
});

type FormData = yup.InferType<typeof schema>;

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Replace with your submit logic (e.g., API call)
    alert("Form submitted!\n" + JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.row}>
          <div className={styles.fieldGroup} style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="First name *"
              className={styles.input}
              autoComplete="given-name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <span style={{ color: "#c00", fontSize: "0.95em" }}>{errors.firstName.message}</span>
            )}
          </div>
          <div className={styles.fieldGroup} style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Last name *"
              className={styles.input}
              autoComplete="family-name"
              {...register("lastName")}
            />
            {errors.lastName && (
              <span style={{ color: "#c00", fontSize: "0.95em" }}>{errors.lastName.message}</span>
            )}
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <input
            type="email"
            placeholder="Work Email *"
            className={styles.input}
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <span style={{ color: "#c00", fontSize: "0.95em" }}>{errors.email.message}</span>
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
            <span style={{ color: "#c00", fontSize: "0.95em" }}>{errors.message.message}</span>
          )}
        </div>
        <p className={styles.privacyText}>
          For information about our privacy practices and commitment to protecting your privacy, please review our{' '}
          <a href="#" className={styles.privacyLink}>
            Privacy Policy
          </a>.
        </p>
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        {isSubmitSuccessful && (
          <p style={{ color: "green", marginTop: "1rem" }}>Thank you for your message!</p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
