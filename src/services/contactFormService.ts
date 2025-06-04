import type { ContactFormData } from "@/schemas/contactFormSchema";

export const submitContactForm = async (data: ContactFormData) => {
  try {
    const response = await fetch('/.netlify/functions/store-contact-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};
