// const { chromium } = require('@playwright/test');
//
// (async () => {
//     const browser = await chromium.launch({ headless: false });
//     const page = await browser.newPage();
//
//     await page.goto('http://localhost:9080');
//
//     console.log('⏳ Please log in manually in the browser...');
//
//     await page.waitForTimeout(60000); // 60 seconds for login
//
//     await page.context().storageState({ path: 'auth.json' });
//     console.log('Saved login session to auth.json');
//
//     await browser.close();
// })();
