import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './frontend/src/test',
    timeout: 30 * 1000, // 30 seconds per test
    expect: {
        timeout: 5000, // 5 seconds max for expect() conditions
    },
    fullyParallel: true, // Run tests in parallel

    use: {
        // baseURL: 'http://localhost:9080',
        // storageState: 'auth.json',        // Use saved login session
        baseURL: 'http://localhost:9080',
        storageState: 'auth.json',
        trace: 'on-first-retry',
        headless: true,                   // Change to false for visible browser
        viewport: { width: 1280, height: 720 },
        actionTimeout: 0,
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',    // Capture screenshots if tests fail
        video: 'retain-on-failure',       // Keep video on failure
        // trace: 'retain-on-failure',       // Save trace on failure for debugging
    },

    projects: [
        // {
        //     name: 'chromium',
        //     use: { ...devices['Desktop Brave'] },
        // },
        // Uncomment if you want to test in more browsers
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },

        {
            name: 'guest',
            testMatch: /.*guest\.spec\.ts/,
            use: { storageState: undefined },
        },
        {
            name: 'auth',
            testMatch: /.*auth\.spec\.ts/,
            use: { storageState: 'auth.json' },
        },
    ],



    // Folder to store screenshots, traces, etc.
    outputDir: 'test-results/',
});

