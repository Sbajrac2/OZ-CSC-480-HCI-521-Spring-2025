// // import { test, expect } from '@playwright/test';
// // test.use({ storageState: 'auth.json' });
// //
// // test('TC_011: Registered user can add a tag to a quote', async ({ page }) => {
// //     await page.goto('/');
// //
// //     // // Login
// //     // await page.click('text=Login');
// //     // await page.fill('#email', 'QuoteCSC480@gmail.com');
// //     // await page.fill('#password', 'Quote_#480');
// //     // await page.click('button:has-text("Login")');
// //
// //     // Select quote
// //     await page.click('text="It is never too late to be what you might have been."');
// //     await page.click('button:has-text("Edit")');
// //
// //     // Add tag
// //     await page.fill('input[placeholder="Add tag"]', 'Motivation');
// //     await page.press('input[placeholder="Add tag"]', 'Enter');
// //
// //     // Save
// //     await page.click('button:has-text("Save")');
// //
// //     // Assertions
// //     await expect(page.locator('text=Motivation')).toBeVisible();
// //     await expect(page.locator('.notification')).toHaveText(/saved successfully/i);
// // });
// //
// // //
// // // test('TC_012: Registered user can remove a tag from a quote', async ({ page }) => {
// // //     await page.goto('localhost:9080');
// // //
// // //     // Login
// // // // Login
// // // await page.click('text=Login');
// // // await page.fill('#email', 'QuoteCSC480@gmail.com');
// // // await page.fill('#password', 'Quote_#480');
// // // await page.click('button:has-text("Login")');
// // //     // Select quote
// // //     await page.click('text="It is never too late to be what you might have been."');
// // //     await page.click('button:has-text("Edit")');
// // //
// // //     // Remove tag
// // //     await page.click('button[aria-label="Remove tag"][data-tag="Inspiration"]');
// // //
// // //     // Save
// // //     await page.click('button:has-text("Save")');
// // //
// // //     // Assertions
// // //     await expect(page.locator('text=Inspiration')).not.toBeVisible();
// // //     await expect(page.locator('.notification')).toHaveText(/saved successfully/i);
// // // });
// // //
// // // test('TC_013: Guest user cannot remove a tag', async ({ page }) => {
// // //     await page.goto('localhost:9080');
// // //
// // //     // Try to access quote and edit
// // //     await page.click('text="It is never too late to be what you might have been."');
// // //     await page.click('button:has-text("Edit")');
// // //
// // //     // Assertions
// // //     await expect(page.locator('.error-message')).toHaveText(/you must be logged in/i);
// // //     await expect(page.locator('text=Login with Google')).toBeVisible();
// // // });
// // //
// // // test('TC_014: Guest user cannot add a tag', async ({ page }) => {
// // //     await page.goto('localhost:9080');
// // //
// // //     // Try to access quote and edit
// // //     await page.click('text="It is never too late to be what you might have been."');
// // //     await page.click('button:has-text("Edit")');
// // //
// // //     // Assertions
// // //     await expect(page.locator('.error-message')).toHaveText(/you must be logged in/i);
// // //     await expect(page.locator('text=Login with Google')).toBeVisible();
// // // });
// //
// //
// // import { test, expect } from '@playwright/test';
// //
// // test.use({ storageState: 'auth.json' });
// //
// // test('TC_Bookmark_001: User can bookmark the first quote card', async ({ page }) => {
// //     await page.goto('/');
// //
// //     // Wait for the first quote card to appear
// //     const firstCard = page.locator('.quote-card').first();
// //     await expect(firstCard).toBeVisible({ timeout: 10000 }); // extend timeout if needed
// //
// //     // ✅ Find the bookmark button
// //     const bookmarkButton = firstCard.locator('button').filter({ has: page.locator('svg') }).first();
// //
// //     // ✅ Click it
// //     await bookmarkButton.click();
// //
// //     // ✅ Confirm visual feedback or success
// //     await expect(bookmarkButton).toHaveCSS('color', 'rgb(0, 128, 0)');
// // });
//
//
// //
// // test('TC_Bookmark_001: Any quote card can be bookmarked', async ({ page }) => {
// //     await page.goto('/');
// //
// //     // Locate the first quote card
// //     const firstQuoteCard = page.locator('.quote-card').first();
// //
// //     // Find and click the bookmark icon
// //     const bookmarkButton = firstQuoteCard.locator('button:has(svg)').nth(1); // assuming second icon is bookmark
// //     await bookmarkButton.click();
// //
// //     // Expect visual change (e.g. icon color or fill)
// //     await expect(bookmarkButton).toHaveCSS('color', 'rgb(0, 128, 0)'); // or test the presence of .bookmark-fill
// //
// //     // Optional: check localStorage if bookmark state is saved there
// //     const bookmarkedIds = await page.evaluate(() =>
// //         JSON.parse(localStorage.getItem('bookmarkedQuotes') || '[]')
// //     );
// //     expect(bookmarkedIds.length).toBeGreaterThan(0); // assumes some quotes were bookmarked
// // });
//
// //
// // test('TC_Bookmark_002: All quote cards have working bookmark buttons', async ({ page }) => {
// //     await page.goto('/');
// //
// //     const quoteCards = page.locator('.quote-card');
// //     const count = await quoteCards.count();
// //
// //     expect(count).toBeGreaterThan(0);
// //
// //     for (let i = 0; i < count; i++) {
// //         const card = quoteCards.nth(i);
// //         const bookmarkButton = card.locator('button:has(svg)').nth(1);
// //         await bookmarkButton.click();
// //         await expect(bookmarkButton).toHaveCSS('color', 'rgb(0, 128, 0)');
// //     }
// // });
//
// import { test, expect } from '@playwright/test';
//
// test('TC_Bookmark_001: User can bookmark the first quote card', async ({ page }) => {
//     await page.goto('/');
//
//     const firstCard = page.locator('.quote-card').first();
//     await expect(firstCard).toBeVisible();
//
//     const bookmarkBtn = firstCard.locator('[data-testid="bookmark-button"]');
//     await bookmarkBtn.click();
//
//     // Example: color change or icon toggle
//     await expect(bookmarkBtn).toHaveCSS('color', 'rgb(0, 128, 0)');
// });
//

import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('TC_Bookmark_001: User can bookmark the first quote card', async ({ page }) => {
    // Step 1: Go to the app
    await page.goto('http://localhost:9080');

    // Step 2: Wait until quote cards are loaded
    await page.waitForSelector('[data-testid="quote-card"]', { timeout: 10000 });

    // Step 3: Find the first quote card
    const firstCard = page.locator('[data-testid="quote-card"]').first();
    await expect(firstCard).toBeVisible();

    // Step 4: Click the bookmark button
    const bookmarkButton = firstCard.locator('[data-testid="bookmark-button"]');
    await bookmarkButton.click();

    // Step 5: Assert that the bookmark worked (icon color or count change)
    await expect(bookmarkButton).toHaveCSS('color', 'rgb(0, 128, 0)');
});
