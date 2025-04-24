 // import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//     await page.goto('http://localhost:9080/');
//     await page.locator('div').filter({ hasText: /^Welcome!$/ }).getByRole('button').click();
//     await page.getByRole('button', { name: 'Sign in' }).click();
//     await page.getByRole('button', { name: 'G Continue with Google' }).click();
//     await page.getByRole('textbox', { name: 'Email or phone' }).click();
//     await page.getByRole('textbox', { name: 'Email or phone' }).fill('QuoteCSC480@gmail.com');
//     await page.getByRole('button', { name: 'Next' }).click();
//     await page.getByRole('textbox', { name: 'Enter your password' }).click();
//     await page.getByRole('textbox', { name: 'Enter your password' }).fill('Quote_#480');
//     await page.getByRole('button', { name: 'Next' }).click();
//     await page.getByRole('button', { name: 'Continue' }).click();
// });

// import { test, expect } from '@playwright/test';
//
// test('real Google OAuth flow test', async ({ page }) => {
//     // Navigate to your application that starts the OAuth flow.
//     await page.goto('http://localhost:9080/');
//
//     // Click the button that initiates the Google OAuth flow.
//     await page.getByRole('button', { name: 'G Continue with Google' }).click();
//
//     // At this point, you'll be redirected to Google's sign-in page.
//     // The following steps are very sensitive to UI changes on Google's side.
//     await page.fill('input[type="email"]', 'QuoteCSC480@gmail.com');
//     await page.click('button[jsname="LgbsSe"]'); // This selector may change
//
//     // Wait and fill the password field.
//     await page.waitForSelector('input[type="password"]');
//     await page.fill('input[type="password"]', 'Quote_#480');
//     await page.click('button[jsname="LgbsSe"]');
//
//     // Wait for the redirection back to your application.
//     await page.waitForNavigation({ waitUntil: 'networkidle' });
//
//     // Verify the logged-in state, e.g., by checking the "whoami" endpoint response or user info element.
//     const userInfo = await page.waitForSelector('#user-info');
//     const textContent = await userInfo.textContent();
//     expect(textContent).toContain('Your Expected User Info');
// });

import { test, expect } from '@playwright/test';

test('Google OAuth flow test', async ({ page }) => {
    // Navigate to your application
    await page.goto('http://localhost:9080/');

    // Click the button inside the div with the text "Welcome!"
    await page.getByRole('button', { name: /Welcome!/i }).click();

    // Click the "Sign in" button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Click the "G Continue with Google" button
    await page.getByRole('button', { name: 'G Continue with Google' }).click();

    // On the Google sign-in page, click the email/phone textbox and fill in the email address
    await page.getByRole('textbox', { name: 'Email or phone' }).click();
    await page.getByRole('textbox', { name: 'Email or phone' }).fill('QuoteCSC480@gmail.com');

    // Click the "Next" button after entering the email
    await page.getByRole('button', { name: 'Next' }).click();

    // Click the password textbox and fill in the password
    await page.getByRole('textbox', { name: 'Enter your password' }).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Quote_#480');

    // Click the "Next" button after entering the password
    await page.getByRole('button', { name: 'Next' }).click();

    // Click the "Continue" button to finish the flow
    await page.getByRole('button', { name: 'Continue' }).click();
});
//
//  import { test, expect } from '@playwright/test';
//
//  test('TC_GoogleOAuth_002: Login using top Sign In button - Google OAuth', async ({ page }) => {
//      // Step 1: Go to homepage
//      await page.goto('http://localhost:9080/');
//
//      // Step 2: Click on "Sign in" which navigates to /login
//      await page.getByRole('button', { name: /Sign in/i }).click();
//      await expect(page).toHaveURL(/\/login/);
//
//      // Step 3: Wait for modal and click "Continue with Google"
//      const [popup] = await Promise.all([
//          page.waitForEvent('popup'),
//          page.getByRole('button', { name: /Continue with Google/i }).click()
//      ]);
//
//      // Step 4: Interact with Google login popup
//      await popup.waitForLoadState();
//
//      await popup.getByRole('textbox', { name: /Email or phone/i }).fill('QuoteCSC480@gmail.com');
//      await popup.keyboard.press('Enter');
//
//      await popup.getByRole('textbox', { name: /Enter your password/i }).fill('Quote_#480');
//      await popup.keyboard.press('Enter');
//
//      await popup.waitForEvent('close');
//
//      // Step 5: Confirm successful login on main page
//      await expect(page.getByRole('button', { name: /Log Out/i })).toBeVisible();
//  });
