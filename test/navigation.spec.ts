import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation and CTA Activation', () => {

    test('TC_059: Keyboard Navigation Using TAB Key', async ({ page }) => {
        await page.goto('http://localhost:9080');

        // Define the expected order of interactive elements by their selectors.
        const interactiveSelectors = [
            'nav >> text=Home',
            'nav >> text=Add a Quote',
            'nav >> text=My Collection',
            'nav >> text=Sign In',
            '#search-input',
            '.quote-card .clipboard-icon',
            '.quote-card .bookmark-icon',
            '.quote-card .share-icon',
            '.quote-card .report-icon'
        ];

        // Loop through the expected elements and press Tab to check focus.
        for (const selector of interactiveSelectors) {
            // Press Tab to move focus to the next interactive element.
            await page.keyboard.press('Tab');

            // Assert that the element identified by the selector is focused.
            await expect(page.locator(selector)).toBeFocused();

            // Optionally verify that the element has a visible focus indicator.
            const outline = await page.locator(selector).evaluate(el => window.getComputedStyle(el).outline);
            expect(outline).not.toBe('none');
            expect(outline).not.toBe('');
        }
    });

    test('TC_061: Verify CTAs are activated using the Enter key', async ({ page, context }) => {
        await page.goto('http://localhost:9080');

        // --- Example: Activate the Copy function via Enter key ---
        // Focus the clipboard icon for the first quote card.
        const clipboardIcon = page.locator('.quote-card .clipboard-icon').first();
        await clipboardIcon.focus();

        // Grant permissions for clipboard access.
        await context.grantPermissions(['clipboard-read']);

        // Press Enter to simulate activation.
        await page.keyboard.press('Enter');

        // Get the expected quote text.
        const firstQuoteText = await page.locator('.quote-card .quote-text').first().textContent();
        // Verify that the quote text was copied to the clipboard.
        const copiedText = await page.evaluate(() => navigator.clipboard.readText());
        expect(copiedText).toContain(firstQuoteText?.trim());

        // --- Example: Activate a CTA (e.g., Sign In) using Enter ---
        const signInButton = page.locator('nav >> text=Sign In');
        await signInButton.focus();
        await page.keyboard.press('Enter');
        // Verify that pressing Enter navigates to the login page.
        await expect(page).toHaveURL(/.*login.*/);
    });
});
