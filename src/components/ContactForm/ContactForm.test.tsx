import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactForm from './ContactForm';
import { submitContactForm } from '@/services/contactFormService';

// Mock the submitContactForm function
vi.mock('@/services/contactFormService', () => ({
  submitContactForm: vi.fn().mockResolvedValue({
    message: 'Form submitted successfully',
    submissionId: '123',
  }),
}));

describe('ContactForm', () => {
  let mockSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSubmit = submitContactForm as ReturnType<typeof vi.fn>;
    mockSubmit.mockClear();
  });
  it('renders the form with all fields', () => {
    render(<ContactForm onSubmit={mockSubmit} />);

    // Check that form elements are rendered
    expect(screen.getByLabelText(/first name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/work email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it("should display required error when value is invalid", async () => {
    render(<ContactForm onSubmit={mockSubmit} />)
  
    fireEvent.submit(screen.getByRole("button"))
  
    expect(await screen.findAllByRole("alert")).toHaveLength(4)
    expect(mockSubmit).not.toBeCalled()
  })

  it("should display matching error when email is invalid", async () => {
    render(<ContactForm onSubmit={mockSubmit} />)
    
    // Fill first name with test
    fireEvent.input(screen.getByLabelText(/first name \*/i), {
      target: {
        value: "test",
      },
    })
    
    // Fill last name with test
    fireEvent.input(screen.getByLabelText(/last name \*/i), {
      target: {
        value: "test",
      },
    })
    
    // Fill email with invalid format
    fireEvent.input(screen.getByLabelText(/work email \*/i), {
      target: {
        value: "test",
      },
    })
    
    // Fill message with test
    fireEvent.input(screen.getByLabelText(/message \*/i), {
      target: {
        value: "test",
      },
    })
  
    fireEvent.submit(screen.getByRole("button"))
  
    expect(await screen.findAllByRole("alert")).toHaveLength(1)
    expect(mockSubmit).not.toBeCalled()
    
    // Verify all fields maintain their values
    expect(screen.getByLabelText(/first name \*/i)).toHaveValue("test")
    expect(screen.getByLabelText(/last name \*/i)).toHaveValue("test")
    expect(screen.getByLabelText(/work email \*/i)).toHaveValue("test")
    expect(screen.getByLabelText(/message \*/i)).toHaveValue("test")
  })



});
