import { test, expect } from '@playwright/test';
test.use({ storageState: 'auth.json' });


test.describe('Passed Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:9083');
    });


    test('TC_001: Verify Web Application Launches Successfully on Server (LOG_001)', async ({ page }) => {
        await expect(page.locator('body')).toBeVisible();
    });


    test('TC_003: Verify Google Authentication Button is Present (LOG_003)', async ({ page }) => {
        const googleLoginButton = await page.locator('button', { hasText: 'Continue with Google' });
        await expect(googleLoginButton).toBeVisible();
        await expect(googleLoginButton).toBeEnabled();
    });


    test('TC_005: Verify \'Login as Guest\' Button is Present (LOG_005)', async ({ page }) => {
        const guestLoginButton = await page.locator('button', { hasText: 'Continue as Guest' });
        await expect(guestLoginButton).toBeVisible();
        await expect(guestLoginButton).toBeEnabled();
    });


    test('TC_008: Verify Login Popup Does Not Reappear for Logged-In Users (LOG_008)', async ({ page }) => {
        await page.route('http://localhost:9081/users/auth/login', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, user: { id: 1, name: 'Test User' } }),
            });
        });


        const googleLoginButton = await page.locator('button', { hasText: 'Continue with Google' });
        await googleLoginButton.click();
        await page.goto('http://localhost:9083');
        await expect(page.locator('[data-testid="login-box"]')).not.toBeVisible();
    });


    test('TC_010: Verify Security of Login Popup (No Data Leakage) (LOG_010)', async ({ page }) => {
        const googleLoginButton = await page.locator('button', { hasText: 'Continue with Google' });
        let requestOccurred = false;
        page.on('request', (request) => {
            if (request.url().includes('http://localhost:9081/users/auth/login')) {
                requestOccurred = true;
            }
        });
        await googleLoginButton.click();
        await expect(requestOccurred).toBe(true);
    });
});


test.describe('Search Functionality Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:9083');
    });


    test('TC_036: Verify search bar is available on the homepage (LOG_036)', async ({ page }) => {
        const searchBar = page.getByPlaceholder('Search quotes, authors, or themes...');
        await expect(searchBar).toBeVisible();
    });


    test('TC_037: Verify user can enter a search query (LOG_037)', async ({ page }) => {
        const searchBar = page.getByPlaceholder('Search quotes, authors, or themes...');
        await searchBar.fill('Test Query');
        await expect(searchBar).toHaveValue('Test Query');
    });


    test('check if the search button is working', async ({ page }) => {
        const searchButton = page.getByRole('button', { name: 'Search' });
        await expect(searchButton).toBeVisible();
    });
});

