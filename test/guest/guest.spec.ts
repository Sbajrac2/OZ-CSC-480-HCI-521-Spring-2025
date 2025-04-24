// tests/guest.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Guest User Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:9080');
        const closeButton = page.locator('div').filter({ hasText: /^Welcome!$/ }).getByRole('button');
        await closeButton.click();
    });

    test('TC_020: Guests cannot upload quotes', async ({ page }) => {
        await page.getByText('Add Quote').click();
        await page.getByRole('textbox', { name: 'Enter your quote here' }).fill('test as guest');
        await page.getByRole('textbox', { name: 'Unknown' }).fill('guest');
        await page.getByRole('button', { name: '#Willpower' }).click();
        await page.getByRole('button', { name: 'Upload' }).click();

        const modalCloseButton = page.getByRole('button', { name: '×' });
        if (await modalCloseButton.isVisible()) {
            await modalCloseButton.click();
        }

        await page.getByRole('link', { name: 'My Collection' }).click();
        const quoteNotFound = page.getByText('No quotes found.');
        await expect(quoteNotFound).toBeVisible();
    });

    test('TC_021: Guests cannot delete quotes', async ({ page }) => {
        const quote = page.getByText('"It is never too late to be what you might have', { exact: false });
        await quote.click();
        const deleteButton = page.getByRole('button', { name: 'Delete' });
        await expect(deleteButton).toHaveCount(0);
    });

    test('TC_022: Guests cannot edit quotes', async ({ page }) => {
        const quote = page.getByText('"It is never too late to be what you might have', { exact: false });
        await quote.click();
        const editButton = page.getByRole('button', { name: 'Edit' });
        await expect(editButton).toHaveCount(0);
    });

    test('TC_023: Guests cannot bookmark quotes', async ({ page }) => {
        const bookmarkIcon = page.getByRole('button', { name: '3' });
        await bookmarkIcon.click();
        await page.getByRole('link', { name: 'My Collection' }).click();
        const quoteNotFound = page.getByText('No quotes found.');
        await expect(quoteNotFound).toBeVisible();
    });
});
