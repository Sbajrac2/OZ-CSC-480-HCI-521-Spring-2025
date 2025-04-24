import { test, expect } from '@playwright/test';

test.describe("Home Page",()=>{
    test("Should have correct title",async ({page})=>{
        await expect(page).toHaveTitle("Quotable");
    });
});