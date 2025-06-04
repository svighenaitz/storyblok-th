import * as yup from "yup";

export const contactFormSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  message: yup.string().required("Message is required"),
});

export type ContactFormData = yup.InferType<typeof contactFormSchema>;
