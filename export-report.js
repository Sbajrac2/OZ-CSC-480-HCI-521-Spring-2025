const { chromium } = require('playwright'); // or import if using TypeScript
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Load the HTML report locally
    const reportPath = 'file://' + path.resolve('playwright-report/index.html');
    await page.goto(reportPath, { waitUntil: 'networkidle' });

    // Export to PDF
    await page.pdf({
        path: 'playwright-report.pdf',
        format: 'A4',
        printBackground: true
    });

    await browser.close();
    console.log('PDF exported as playwright-report.pdf');
})();
