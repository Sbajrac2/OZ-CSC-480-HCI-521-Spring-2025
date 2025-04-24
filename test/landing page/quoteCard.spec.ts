import { test, expect } from '@playwright/test';
test.use({ storageState: 'auth.json' });

test('copy quote and verify clipboard', async ({ page, context }) => {
    // Navigate to the landing page
    await page.goto('http://localhost:9080');

    // Locate the first quote card and get its text
    const firstQuoteText = await page.locator('quote-card quote-text').first().textContent();

    // Locate the clipboard icon for the first quote card
    const clipboardIcon = page.locator('quote-card clipboard-icon').first();

    // Click on the clipboard icon
    await clipboardIcon.click();

    // Grant permissions for clipboard access
    await context.grantPermissions(['clipboard-read']);

    // Verify that the quote text was copied to the clipboard
    const copiedText = await page.evaluate(() => navigator.clipboard.readText());
    expect(copiedText).toContain(firstQuoteText?.trim()); // Dynamically verify copied text matches the quote

    // Verify that the "Use" button changes to "Used"
    const useButton = page.locator('quote-card use-button').first();
    await expect(useButton).toHaveText('Used');
});
