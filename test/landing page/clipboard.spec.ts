import { test, expect } from '@playwright/test';
test.use({ storageState: 'auth.json' });

test.describe('Clipboard Functionality for Registered and Guest Users', () => {

    // Helper function to simulate user login.
    async function loginUser(page) {
        await page.goto('http://localhost:9080/login');
        // Adjust selectors and credentials as needed.
        await page.fill('#username', 'registeredUser');
        await page.fill('#password', 'password');
        await page.click('button[type="submit"]');
        // Wait for navigation or a logged-in indicator.
        await page.waitForNavigation();
    }

    test('TC_031: Verify registered users can copy quote to clipboard', async ({ page, context }) => {
        await loginUser(page);
        await page.goto('http://localhost:9080');

        // Locate the first quote card and get its text.
        const firstQuoteText = await page.locator('.quote-card .quote-text').first().textContent();

        // Locate and click the clipboard icon.
        const clipboardIcon = page.locator('.quote-card .clipboard-icon').first();
        await clipboardIcon.click();

        // Grant permissions for clipboard access.
        await context.grantPermissions(['clipboard-read']);

        // Verify that the quote text was copied to the clipboard.
        const copiedText = await page.evaluate(() => navigator.clipboard.readText());
        expect(copiedText).toContain(firstQuoteText?.trim());

        // Verify a notification appears confirming the copy action.
        const notification = page.locator('.notification');
        await expect(notification).toHaveText(/copied/i);
    });

    test('TC_032: Verify guests can copy quote to clipboard', async ({ page, context }) => {
        // As a guest, do not perform any login.
        await page.goto('http://localhost:9080');

        // Locate the first quote card and get its text.
        const firstQuoteText = await page.locator('.quote-card .quote-text').first().textContent();

        // Locate and click the clipboard icon.
        const clipboardIcon = page.locator('.quote-card .clipboard-icon').first();
        await clipboardIcon.click();

        // Grant permissions for clipboard access.
        await context.grantPermissions(['clipboard-read']);

        // Verify that the quote text was copied to the clipboard.
        const copiedText = await page.evaluate(() => navigator.clipboard.readText());
        expect(copiedText).toContain(firstQuoteText?.trim());

        // Verify a notification appears confirming the copy action.
        const notification = page.locator('.notification');
        await expect(notification).toHaveText(/copied/i);
    });

    test('TC_033: Verify registered users can copy and paste quotes', async ({ page, context }) => {
        await loginUser(page);
        await page.goto('http://localhost:9080');

        // Locate a quote and retrieve its text.
        const quoteElement = page.locator('.quote-card .quote-text').first();
        const quoteText = await quoteElement.textContent();

        // Click the quote to focus.
        await quoteElement.click();

        // Select the entire text using Ctrl+A (or Cmd+A on macOS).
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');

        // Copy using Ctrl+C.
        await page.keyboard.down('Control');
        await page.keyboard.press('C');
        await page.keyboard.up('Control');

        // Grant clipboard-read permission.
        await context.grantPermissions(['clipboard-read']);

        // Create a temporary input field to paste the copied text.
        await page.evaluate(() => {
            const input = document.createElement('input');
            input.id = 'temp-input';
            document.body.appendChild(input);
        });
        const tempInput = page.locator('#temp-input');
        await tempInput.focus();

        // Paste using Ctrl+V.
        await page.keyboard.down('Control');
        await page.keyboard.press('V');
        await page.keyboard.up('Control');

        // Verify the pasted text matches the original quote.
        const pastedText = await tempInput.inputValue();
        expect(pastedText.trim()).toBe(quoteText?.trim());
    });

    test('TC_034: Verify guests can copy and paste quotes', async ({ page, context }) => {
        // As a guest, do not login.
        await page.goto('http://localhost:9080');

        // Locate a quote and retrieve its text.
        const quoteElement = page.locator('.quote-card .quote-text').first();
        const quoteText = await quoteElement.textContent();

        // Click the quote to focus.
        await quoteElement.click();

        // Select the entire text using Ctrl+A (or Cmd+A on macOS).
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');

        // Copy using Ctrl+C.
        await page.keyboard.down('Control');
        await page.keyboard.press('C');
        await page.keyboard.up('Control');

        // Grant clipboard-read permission.
        await context.grantPermissions(['clipboard-read']);

        // Create a temporary input field to paste the copied text.
        await page.evaluate(() => {
            const input = document.createElement('input');
            input.id = 'temp-input';
            document.body.appendChild(input);
        });
        const tempInput = page.locator('#temp-input');
        await tempInput.focus();

        // Paste using Ctrl+V.
        await page.keyboard.down('Control');
        await page.keyboard.press('V');
        await page.keyboard.up('Control');

        // Verify the pasted text matches the original quote.
        const pastedText = await tempInput.inputValue();
        expect(pastedText.trim()).toBe(quoteText?.trim());
    });
});
