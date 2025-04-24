import { test, expect } from '@playwright/test';
test.use({ storageState: 'auth.json' });

test('TC_026: New user sees account setup page after Google login', async ({ page }) => {
    await page.goto('localhost:9080');

    // Simulate Google OAuth login
    await page.click('button:has-text("Login with Google")');
    // Assume Google popup is handled externally or mocked in test env

    // Assert account setup page loads
    await expect(page.locator('text=Account Setup')).toBeVisible();
    await expect(page.locator('input[name="profession"]')).toBeVisible();
    await expect(page.locator('textarea[name="personalQuote"]')).toBeVisible();
});

test('TC_027: New user can submit profession and personal quote', async ({ page }) => {
    await page.goto('localhost:9080');

    await page.click('button:has-text("Login with Google")');
    await expect(page.locator('text=Account Setup')).toBeVisible();

    await page.fill('input[name="profession"]', 'Software Engineer');
    await page.fill('textarea[name="personalQuote"]', 'Code is poetry.');
    await page.click('button:has-text("Save")');

    await expect(page.locator('.notification')).toHaveText(/profile saved/i);
});

test('TC_028: Setup info matches profile info', async ({ page }) => {
    await page.goto('localhost:9080');
    await page.click('button:has-text("Login with Google")');

    await page.fill('input[name="profession"]', 'Writer');
    await page.fill('textarea[name="personalQuote"]', 'Writing is thinking on paper.');
    await page.click('button:has-text("Save")');

    await page.click('button[aria-label="Profile Icon"]');
    await expect(page.locator('text=Writer')).toBeVisible();
    await expect(page.locator('text=Writing is thinking on paper.')).toBeVisible();
});

test('TC_029: Registered user views their profile', async ({ page }) => {
    await page.goto('localhost:9080');
    await page.click('button:has-text("Login with Google")');

    await page.click('button[aria-label="Profile Icon"]');

    await expect(page.locator('text=Name:')).toBeVisible();
    await expect(page.locator('text=Email:')).toBeVisible();
    await expect(page.locator('text=Profession:')).toBeVisible();
    await expect(page.locator('text=Personal Quote:')).toBeVisible();
});

test('TC_030: Edit personal quote in profile', async ({ page }) => {
    await page.goto('localhost:9080');
    await page.click('button:has-text("Login with Google")');

    await page.click('button[aria-label="Profile Icon"]');
    await page.click('button:has-text("Edit Quote")');
    await page.fill('textarea[name="personalQuote"]', 'Never stop learning.');
    await page.click('button:has-text("Save")');

    await expect(page.locator('text=Never stop learning.')).toBeVisible();
    await expect(page.locator('.notification')).toHaveText(/updated successfully/i);
});

test('TC_040: Edit profession in profile', async ({ page }) => {
    await page.goto('localhost:9080');
    await page.click('button:has-text("Login with Google")');

    await page.click('button[aria-label="Profile Icon"]');
    await page.click('button:has-text("Edit Profession")');
    await page.fill('input[name="profession"]', 'UX Designer');
    await page.click('button:has-text("Save")');

    await expect(page.locator('text=UX Designer')).toBeVisible();
    await expect(page.locator('.notification')).toHaveText(/updated successfully/i);
});

test('TC_041: Guest cannot access profile page', async ({ page }) => {
    await page.goto('localhost:9080');

    await page.click('button[aria-label="Profile Icon"]');

    await expect(page.locator('.error-message')).toHaveText(/must be logged in/i);
    await expect(page.locator('text=Login with Google')).toBeVisible();
});
