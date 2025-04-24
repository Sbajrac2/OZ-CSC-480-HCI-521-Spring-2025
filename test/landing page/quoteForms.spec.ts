import { test, expect } from '@playwright/test';
test.use({ storageState: 'auth.json' });

test('upload quote functionality', async ({ page }) => {
    // Navigate to the landing page
    await page.goto('http://localhost:9080'); // Replace with your actual URL

    // Locate and click the "Add Quote" button in the navbar
    const addQuoteButton = page.getByRole('link', { name: 'Add Quote' });
    await addQuoteButton.click();

    // Wait for the upload quote modal/page to appear
    const uploadModal = page.locator('text=Upload a Quote'); // Adjust selector based on your DOM
    await expect(uploadModal).toBeVisible();

    // Locate the input field for entering the quote text
    const quoteInput = page.getByPlaceholder('Enter your quote here...'); // Replace with actual placeholder text
    await quoteInput.fill('The best way to predict the future is to create it.');

    // Locate the input field for entering the author name
    const authorInput = page.getByPlaceholder('Enter author name...'); // Replace with actual placeholder text
    await authorInput.fill('Peter Drucker');

    // Click the "Submit" button
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    // Verify that the quote was successfully uploaded (e.g., check for success message or updated list)
    const successMessage = page.locator('text=Quote uploaded successfully!');
    await expect(successMessage).toBeVisible();

    // Optionally verify that the new quote appears in the list of quotes
    const newQuote = page.locator('.quote-card').filter({ hasText: 'The best way to predict the future is to create it.' });
    await expect(newQuote).toBeVisible();
});
