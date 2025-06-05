import { test, expect } from '@playwright/test';

test.describe('Contact Form E2E Tests', () => {
  // Setup - navigate to the contact form page before each test
  test.beforeEach(async ({ page }) => {
    // Navigate to your form page - adjust the URL to where your form is located
    await page.goto('/');
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    // Find and submit the form without entering any data
    await page.getByTestId('contact-form').getByRole('button', { name: 'Send Message' }).click();

    // Check that all 4 required field error messages are displayed
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Message is required')).toBeVisible();

    // Verify we have 4 error messages in total
    const errorMessages = page.locator('[role="alert"]');
    await expect(errorMessages).toHaveCount(4);
  });

  test('should show email format validation error when email is invalid', async ({ page }) => {
    // Fill in all fields correctly except for the email
    await page.getByLabel('First name *').fill('John');
    await page.getByLabel('Last name *').fill('Doe');
    await page.getByLabel('Work Email *').fill('invalid-email'); // Invalid email format
    await page.getByLabel('Message *').fill('This is a test message');
    
    // Submit the form
    await page.getByTestId('contact-form').getByRole('button', { name: 'Send Message' }).click();

    // Check for email validation error message
    await expect(page.getByText('Enter a valid email address')).toBeVisible();
    
    // Verify we only have one error message
    const errorMessages = page.locator('[role="alert"]');
    await expect(errorMessages).toHaveCount(1);
  });

  test('should display success message after successful form submission', async ({ page }) => {
    // Mock successful API response for form submission
    await page.route('**/.netlify/functions/store-contact-info', async route => {
      // Mock a successful response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Form submitted successfully' })
      });
    });
    
    // Fill in all fields correctly
    await page.getByLabel('First name *').fill('John');
    await page.getByLabel('Last name *').fill('Doe');
    await page.getByLabel('Work Email *').fill('john.doe@example.com'); // Valid email
    await page.getByLabel('Message *').fill('This is a test message');
    
    // Submit the form
    await page.getByTestId('contact-form').getByRole('button', { name: 'Send Message' }).click();

    // Check for success message
    await expect(page.getByText('Thank you for your message!')).toBeVisible({ timeout: 10000 });
    
    // Verify there are no error messages
    const errorMessages = page.locator('[role="alert"]');
    await expect(errorMessages).toHaveCount(0);
  });
  
  test('should display error message when form submission fails', async ({ page }) => {
    // Mock failed API response
    await page.route('**/.netlify/functions/store-contact-info', async route => {
      // Mock a server error response
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Server error' })
      });
    });
    
    // Fill in all fields correctly
    await page.getByLabel('First name *').fill('John');
    await page.getByLabel('Last name *').fill('Doe');
    await page.getByLabel('Work Email *').fill('john.doe@example.com');
    await page.getByLabel('Message *').fill('This is a test message');
    
    // Submit the form
    await page.getByTestId('contact-form').getByRole('button', { name: 'Send Message' }).click();

    // Verify the error message is displayed
    await expect(page.getByText('Something went wrong with submission.')).toBeVisible({ timeout: 10000 });
    
    // Also verify that the button is enabled again after submission
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeEnabled();
  });
});
