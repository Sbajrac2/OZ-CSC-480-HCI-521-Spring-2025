// literally everything failed bro but it should have worked hahahaahhahahah

import { test, expect } from '@playwright/test';
test.use({ storageState: 'auth.json' });

test.describe('Quote Functionality Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:9083');
    });

    test('TC_015: Verify registered users can upload quotes (LOG_015)', async ({ page }) => {
        // 1. Intercept login request BEFORE clicking the button
        await page.route('http://localhost:9081/users/auth/login', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, user: { id: 1, name: 'Test User' } }),
            });
        });

        // 2. Intercept `whoami` (or whatever your app uses to verify session)
        await page.route('**/whoami', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ id: 1, name: 'Test User' }),
            });
        });

        // 3. Go to the app *before* clicking login
        await page.goto('http://localhost:9080');

        // 4. Click the login button (after route mocks are set)
        const googleLoginButton = page.locator('button', { hasText: 'Continue with Google' });
        await googleLoginButton.click();

        // 5. Navigate to "Upload Quote" (assuming user is now logged in)
        await page.locator('a', { hasText: 'Upload Quote' }).click();

        // 6. Fill in quote and author
        await page.fill('textarea[placeholder="Enter your quote here"]', 'A test quote.');
        await page.fill('input[placeholder="Unknown"]', 'Test Author');

        // 7. Click upload
        await page.locator('button', { hasText: 'Upload' }).click();

        // 8. Assert success notification
        await expect(page.locator('[data-testid="success-notification"]')).toBeVisible();
    });


    test('TC_016: Verify registered users cannot upload empty quotes (LOG_015.a)', async ({ page }) => {
        // Simulate a logged-in user
        const googleLoginButton = await page.locator('button', { hasText: 'Continue with Google' });
        await googleLoginButton.click();
        await page.route('http://localhost:9081/users/auth/login', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, user: { id: 1, name: 'Test User' } }),
            });
        });
        await page.goto('http://localhost:9083');

        // Go to upload quote page
        await page.locator('a', { hasText: 'Upload Quote' }).click();

        // Fill in author, but leave quote blank
        await page.fill('input[placeholder="Unknown"]', 'Test Author');

        // Attempt to upload
        await page.locator('button', { hasText: 'Upload' }).click();

        // Verify upload fails (check for error message)
        await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });

    test('TC_017: Verify registered users can delete their uploaded quotes (LOG_016)', async ({ page }) => {
        // Simulate a logged-in user
        const googleLoginButton = await page.locator('button', { hasText: 'Continue with Google' });
        await googleLoginButton.click();
        await page.route('http://localhost:9081/users/auth/login', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, user: { id: 1, name: 'Test User' } }),
            });
        });
        await page.goto('http://localhost:9083');

        // Find and click a quote
        await page.locator('[data-testid="quote-item"]').first().click();

        // Delete the quote
        await page.locator('button', { hasText: 'Delete' }).click();

        // Verify deletion
        await expect(page.locator('[data-testid="success-notification"]')).toBeVisible();
    });

    test('TC_018: Verify registered users can edit their quotes (LOG_017)', async ({ page }) => {
        // Simulate a logged-in user
        const googleLoginButton = await page.locator('button', { hasText: 'Continue with Google' });
        await googleLoginButton.click();
        await page.route('http://localhost:9081/users/auth/login', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, user: { id: 1, name: 'Test User' } }),
            });
        });
        await page.goto('http://localhost:9083');

        // Find and click a quote
        await page.locator('[data-testid="quote-item"]').first().click();

        // Edit the quote
        await page.locator('button', { hasText: 'Edit' }).click();
        await page.fill('textarea[placeholder="Enter your quote here"]', 'An edited quote.');
        await page.locator('button', { hasText: 'Save' }).click();

        // Verify edit
        await expect(page.locator('[data-testid="success-notification"]')).toBeVisible();
        await expect(page.locator('[data-testid="quote-text-display"]')).toHaveText('An edited quote.');
    });

    test('TC_019: Verify registered users can save quotes (LOG_019)', async ({ page }) => {
        // Simulate a logged-in user
        const googleLoginButton = await page.locator('button', { hasText: 'Continue with Google' });
        await googleLoginButton.click();
        await page.route('http://localhost:9081/users/auth/login', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, user: { id: 1, name: 'Test User' } }),
            });
        });
        await page.goto('http://localhost:9083');

        // Find a quote and click the bookmark icon
        await page.locator('[data-testid="bookmark-icon"]').first().click();

        // Verify save
        await expect(page.locator('[data-testid="success-notification"]')).toBeVisible();
    });

    test('TC_020: Verify guests cannot upload quotes (LOG_020)', async ({ page }) => {
        // Attempt to go to upload quote page
        await page.locator('a', { hasText: 'Upload Quote' }).click();

        // Verify error message and login popup
        await expect(page.locator('[data-testid="guest-error-message"]')).toBeVisible();
        await expect(page.locator('[data-testid="login-box"]')).toBeVisible();
    });
});


