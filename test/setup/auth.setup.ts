
import { test, expect } from '@playwright/test';


test('Login and save storage state', async ({ page }) => {
    await page.goto('http://localhost:9080');

    const googleLoginButton = page.getByRole('button', { name: 'Continue with Google' });
    await googleLoginButton.click();

    // Wait until user is logged in
    await expect(page.locator('[data-testid="login-box"]')).not.toBeVisible();

    // Save login session
    await page.context().storageState({ path: 'auth.json' });
});
