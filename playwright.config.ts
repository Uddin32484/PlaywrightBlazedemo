import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { 
      open: 'never',
      host: '0.0.0.0', 
      port: 9323,
      attachmentsBaseURL: 'file:///' + __dirname + '/test-results/'
    }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['line']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://blazedemo.com',

    /* Run tests in headed mode (visible browser) */
    headless: false,

    /* Screenshot configuration */
    screenshot: 'only-on-failure', // Options: 'off', 'on', 'only-on-failure', 'on-first-retry'
    
    /* Video recording */
    video: 'retain-on-failure', // Options: 'off', 'on', 'retain-on-failure', 'on-first-retry'
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry', // Options: 'off', 'on', 'retain-on-failure', 'on-first-retry'
    
    /* Global timeout for each action */
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    /* Additional Android Devices */
    {
      name: 'Android Pixel 7',
      use: { ...devices['Pixel 7'] },
    },

    // {
    //   name: 'Android Galaxy S8',
    //   use: { ...devices['Galaxy S8'] },
    // },

    // {
    //   name: 'Android Galaxy S9+',
    //   use: { ...devices['Galaxy S9+'] },
    // },

    // {
    //   name: 'Android Galaxy Tab S4',
    //   use: { ...devices['Galaxy Tab S4'] },
    // },

    {
      name: 'Android Galaxy Note 3',
      use: { ...devices['Galaxy Note 3'] },
    },

    /* iOS Devices */
    {
      name: 'iOS iPhone 13',
      use: { ...devices['iPhone 13'] },
    },

    // {
    //   name: 'iOS iPhone 13 Pro',
    //   use: { ...devices['iPhone 13 Pro'] },
    // },

    // {
    //   name: 'iOS iPhone 13 Pro Max',
    //   use: { ...devices['iPhone 13 Pro Max'] },
    // },

    // {
    //   name: 'iOS iPhone 14',
    //   use: { ...devices['iPhone 14'] },
    // },

    // {
    //   name: 'iOS iPhone 14 Plus',
    //   use: { ...devices['iPhone 14 Plus'] },
    // },

    // {
    //   name: 'iOS iPhone 14 Pro',
    //   use: { ...devices['iPhone 14 Pro'] },
    // },

    // {
    //   name: 'iOS iPhone 14 Pro Max',
    //   use: { ...devices['iPhone 14 Pro Max'] },
    // },

    // {
    //   name: 'iOS iPhone 15',
    //   use: { ...devices['iPhone 15'] },
    // },

    // {
    //   name: 'iOS iPhone 15 Plus',
    //   use: { ...devices['iPhone 15 Plus'] },
    // },

    // {
    //   name: 'iOS iPhone 15 Pro',
    //   use: { ...devices['iPhone 15 Pro'] },
    // },

    // {
    //   name: 'iOS iPhone 15 Pro Max',
    //   use: { ...devices['iPhone 15 Pro Max'] },
    // },

    // {
    //   name: 'iOS iPad Pro',
    //   use: { ...devices['iPad Pro'] },
    // },

    // {
    //   name: 'iOS iPad Pro 11',
    //   use: { ...devices['iPad Pro 11'] },
    // },

    {
      name: 'iOS iPad Mini',
      use: { ...devices['iPad Mini'] },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',
});
