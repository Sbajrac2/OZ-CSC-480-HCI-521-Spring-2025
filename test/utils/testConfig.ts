import { test, expect } from '@playwright/test';

export async function waitForToast(page, text: string) {
    await expect(page.locator('.toast')).toHaveText(new RegExp(text, 'i'), { timeout: 3000 });
}
