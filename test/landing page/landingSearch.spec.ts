import { test, expect } from '@playwright/test';
test.use({ storageState: 'auth.json' });

test('check if the search bar is present', async ({ page }) => {
    await page.goto('http://localhost:9080');
    const searchBar = page.getByPlaceholder('Search quotes, authors, or themes...');
    await expect(searchBar).toBeVisible(); // Assert that the search bar is visible
});


test('check if you can type in the search bar', async ({ page }) => {
    await page.goto('http://localhost:9080');
    const searchBar = page.getByPlaceholder('Search quotes, authors, or themes...');
    await searchBar.fill('Life'); // Type into the search bar
    await expect(searchBar).toHaveValue('Life'); // Assert that the value matches
});


test('check if the search button is working', async ({ page }) => {
    await page.goto('http://localhost:9080');
    const searchButton = page.getByRole('button', { name: 'Search' });
    await expect(searchButton).toBeVisible(); // Assert that the button is visible
});

test('check if the search feature is working', async ({ page }) => {
    await page.goto('http://localhost:9080');
    const searchBar = page.getByPlaceholder('Search quotes, authors, or themes...');
    await searchBar.fill('Life'); // Type into the search bar
    const searchButton = page.getByRole('button', { name: 'Search' });
    await searchButton.click(); // Click the Search button

    // Wait for results to load
    const results = page.getByText('Search Results#Life"').click();
    await page.getByText('Search Results#Life"').click();

    await page.waitForSelector('.results-container', { state: 'visible' });
    await expect(page.locator('.results-container')).toContainText('Life');
});



