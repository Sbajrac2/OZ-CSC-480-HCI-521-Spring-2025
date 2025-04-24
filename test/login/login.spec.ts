// // // import { test, expect } from '@playwright/test';
// // //
// // // test('verify login overlay appears on landing page', async ({ page }) => {
// // //     // Navigate to the landing page
// // //     await page.goto('http://localhost:9080');
// // //
// // //     // Wait for the login overlay to appear
// // //     const loginOverlay = page.locator('text=Welcome!'); // Locate the overlay by its text
// // //     await expect(loginOverlay).toBeVisible(); // Assert that the overlay is visible
// // //
// // //     // Verify "Continue with Google" button is present
// // //     const googleButton = page.getByRole('button', { name: 'Continue with Google' });
// // //     await expect(googleButton).toBeVisible();
// // //
// // //     // Verify "Continue as Guest" button is present
// // //     const guestButton = page.getByRole('button', { name: 'Continue as Guest' });
// // //     await expect(guestButton).toBeVisible();
// // //
// // //     // Verify close button (X) is present
// // //     const closeButton = page.locator('button[aria-label="Close"]');
// // //     await expect(closeButton).toBeVisible();
// // // });
// // //
// // // //click sign in
// // // test('verify login overlay appears when clicking Sign In', async ({ page }) => {
// // //     // Navigate to the landing page
// // //     await page.goto('http://localhost:9080'); // Replace with your actual URL
// // //
// // //     // Click on the "Sign In" button
// // //     const signInButton = page.getByRole('button', { name: 'Sign in' });
// // //     await signInButton.click();
// // //
// // //     // Wait for the login overlay to appear
// // //     const loginOverlay = page.locator('text=Welcome!');
// // //     await expect(loginOverlay).toBeVisible(); // Assert that the overlay is visible
// // //
// // //     // Verify "Continue with Google" button is present
// // //     const googleButton = page.getByRole('button', { name: 'Continue with Google' });
// // //     await expect(googleButton).toBeVisible();
// // //
// // //     // Verify "Continue as Guest" button is present
// // //     const guestButton = page.getByRole('button', { name: 'Continue as Guest' });
// // //     await expect(guestButton).toBeVisible();
// // //
// // //     // Verify close button (X) is present
// // //     const closeButton = page.locator('button[aria-label="Close"]');
// // //     await expect(closeButton).toBeVisible();
// // // });
// // //
// //
// // import { test, expect } from '@playwright/test';
// //
// // test('test', async ({ page }) => {
// //     await page.goto('http://localhost:9080/');
// //     await page.getByRole('textbox', { name: 'Search quotes, authors, or' }).click();
// //     await page.getByRole('button', { name: 'G Continue with Google' }).click();
// //     await page.getByRole('textbox', { name: 'Email or phone' }).fill('QuoteCSC480@gmail.com');
// //     await page.getByRole('button', { name: 'Next' }).click();
// //     await page.getByRole('textbox', { name: 'Enter your password' }).click();
// //     await page.getByRole('textbox', { name: 'Enter your password' }).fill('Quote_#480');
// //     await page.getByRole('button', { name: 'Next' }).click();
// //     await page.getByRole('button', { name: 'Continue' }).click();
// // });
// //
// // import { test, expect } from '@playwright/test';
// //
// // test('Google OAuth flow test', async ({ page }) => {
// //     // Navigate to your application
// //     await page.goto('http://localhost:9080/');
// //
// //     // Click the button inside the div with the text "Welcome!"
// //     await page.getByRole('button', { name: /Welcome!/i }).click();
// //
// //     // Click the "Sign in" button
// //     await page.getByRole('button', { name: 'Sign in' }).click();
// //
// //     // Click the "G Continue with Google" button
// //     await page.getByRole('button', { name: 'G Continue with Google' }).click();
// //
// //     // On the Google sign-in page, click the email/phone textbox and fill in the email address
// //     await page.getByRole('textbox', { name: 'Email or phone' }).click();
// //     await page.getByRole('textbox', { name: 'Email or phone' }).fill('QuoteCSC480@gmail.com');
// //
// //     // Click the "Next" button after entering the email
// //     await page.getByRole('button', { name: 'Next' }).click();
// //
// //     // Click the password textbox and fill in the password
// //     await page.getByRole('textbox', { name: 'Enter your password' }).click();
// //     await page.getByRole('textbox', { name: 'Enter your password' }).fill('Quote_#480');
// //
// //     // Click the "Next" button after entering the password
// //     await page.getByRole('button', { name: 'Next' }).click();
// //
// //     // Click the "Continue" button to finish the flow
// //     await page.getByRole('button', { name: 'Continue' }).click();
// // });
//
// import { test, expect } from '@playwright/test';
//
// test('Real Google OAuth Flow', async ({ page }) => {
//     // Navigate to your application
//     await page.goto('http://localhost:9080/');
//
//     // Click the button to start the login process (assuming it’s labeled "Sign in" or similar)
//     await page.getByRole('button', { name: 'Sign in' }).click();
//
//     // Click the "G Continue with Google" button to initiate Google OAuth
//     await page.getByRole('button', { name: 'G Continue with Google' }).click();
//
//     // Now, the Google Sign-In page should load.
//     // Fill in the email or phone
//     await page.getByRole('textbox', { name: 'Email or phone' }).fill('QuoteCSC480@gmail.com');
//     await page.getByRole('button', { name: 'Next' }).click();
//
//     // Wait for the password field to appear, then fill in the password
//     await page.waitForSelector('input[type="password"]', { timeout: 15000 });
//     await page.getByRole('textbox', { name: 'Enter your password' }).fill('Quote_#480');
//     await page.getByRole('button', { name: 'Next' }).click();
//
//     // You might have another "Continue" button after successful login
//     await page.waitForNavigation({ waitUntil: 'networkidle' });
//     await page.getByRole('button', { name: 'Continue' }).click();
//
//     // After the OAuth flow, verify that the user is logged in by checking a user-specific element.
//     const userInfo = await page.waitForSelector('#user-info', { timeout: 15000 });
//     const text = await userInfo.textContent();
//     expect(text).toContain('ExpectedUserName'); // Adjust to match the logged-in user's name
// });
//
// import { test, expect } from '@playwright/test';
//
// test.use({ storageState: 'auth.json' });
//
//
// test('TC_GoogleOAuth_001: Login using welcome popup - Google OAuth', async ({ page }) => {
//     await page.goto('http://localhost:9080/');
//
//     // Wait for the welcome popup and click the "Continue with Google" button
//     const [popup] = await Promise.all([
//         page.waitForEvent('popup'),
//         page.getByRole('button', { name: /Continue with Google/i }).click()
//     ]);
//
//     // Interact with the popup for Google OAuth
//     await popup.waitForLoadState();
//
//     await popup.getByRole('textbox', { name: /Email or phone/i }).fill('QuoteCSC480@gmail.com');
//     await popup.keyboard.press('Enter');
//
//     await popup.getByRole('textbox', { name: /Enter your password/i }).fill('Quote_#480');
//     await popup.keyboard.press('Enter');
//
//     await popup.waitForEvent('close');
//
//     // Verify user is logged in (e.g., "Log Out" button visible or avatar)
//     await expect(page.getByRole('button', { name: /Log Out/i })).toBeVisible();
// });
import { test, expect } from '@playwright/test';

// ✅ Use the saved login session
test.use({ storageState: 'auth.json' });

test('TC_GoogleOAuth_001: Logged-in user can see welcome popup', async ({ page }) => {
    await page.goto('/'); // Use baseURL from playwright.config.ts

    // 🧪 Expect a logged-in element
    // Adjust this selector to whatever confirms you're logged in (e.g., profile, logout, etc.)
    await expect(page.locator('text=Welcome')).toBeVisible();
});

test('TC_004: User can login with Google (LOG_004)', async ({ page }) => {
    await page.goto('http://localhost:9080');
    const googleLogin = page.getByRole('button', { name: 'Continue with Google' });
    await googleLogin.click();

    await expect(page.locator('[data-testid="login-box"]')).not.toBeVisible();
});

test('TC_009: App handles failed Google login gracefully (LOG_009)', async ({ page }) => {
    await page.route('**/users/auth/login', route => {
        route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ success: false, error: 'Unauthorized' }),
        });
    });

    const googleLogin = page.getByRole('button', { name: 'Continue with Google' });
    await googleLogin.click();

    const errorToast = page.locator('.toast').filter({ hasText: /unauthorized/i });
    await expect(errorToast).toBeVisible();
});


