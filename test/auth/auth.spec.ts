// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test.describe('Authenticated User Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:9083');
    });

    test('TC_008: Logged-in users skip login popup', async ({ page }) => {
        await expect(page.locator('[data-testid="login-box"]')).not.toBeVisible();
    });

    test('TC_036: Search bar is available', async ({ page }) => {
        const searchBar = page.getByPlaceholder('Search quotes, authors, or themes...');
        await expect(searchBar).toBeVisible();
    });

    test('TC_037: User can enter a search query', async ({ page }) => {
        const searchBar = page.getByPlaceholder('Search quotes, authors, or themes...');
        await searchBar.fill('Test Query');
        await expect(searchBar).toHaveValue('Test Query');
    });

    test('TC_051: Search button is clickable', async ({ page }) => {
        const searchButton = page.getByRole('button', { name: 'Search' });
        await expect(searchButton).toBeVisible();
    });
});
