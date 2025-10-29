import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Chạy tuần tự để tránh conflict
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Chỉ 1 worker
  reporter: 'html',
  timeout: 30000, // Global timeout 30 giây cho mỗi test
  expect: {
    timeout: 10000, // Timeout cho các assertions
  },
  
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 15000, // Timeout cho page navigation
    actionTimeout: 10000, // Timeout cho các actions (click, fill, etc.)
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],

  // Tắt webServer auto-start, dùng server riêng (npm run dev ở terminal khác)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3001',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
