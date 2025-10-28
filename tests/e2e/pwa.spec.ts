import { test, expect } from '@playwright/test';

test.describe('PWA Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Service Worker - Should be registered', async ({ page }) => {
    // Kiểm tra Service Worker đã register
    const swRegistration = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(swRegistration).toBe(true);
    
    // Check service worker scope
    const swScope = await page.evaluate(async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration?.scope;
      } catch {
        return null;
      }
    });
    
    // Service worker should be registered tại root scope
    expect(swScope).toBeTruthy();
  });

  test('PWA Manifest - Should load manifest.json', async ({ page }) => {
    // Check manifest được load
    const manifestLink = await page.locator('link[rel="manifest"]').first().getAttribute('href');
    expect(manifestLink).toBe('/manifest.json');
    
    // Verify manifest content
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);
    
    const manifest = await response?.json();
    expect(manifest).toHaveProperty('name', 'eTax Mobile');
    expect(manifest).toHaveProperty('icons');
  });

  test('Offline Mode - Should cache resources', async ({ page, context }) => {
    // Navigate and load resources
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Set offline
    await context.setOffline(true);
    
    // Try to navigate to a cached page (home)
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Should either load from cache or handle gracefully
    // Note: This might timeout or fail gracefully depending on app logic
    await expect(page.locator('text=eTax Mobile')).toBeVisible();
  });

  test('Meta Tags - Should have proper PWA meta tags', async ({ page }) => {
    // Check theme-color
    const themeColor = await page.locator('meta[name="theme-color"]').first().getAttribute('content');
    expect(themeColor).toBe('#cc0000');
    
    // Check mobile-web-app-capable
    const mobileWebApp = await page.locator('meta[name="mobile-web-app-capable"]').first().getAttribute('content');
    expect(mobileWebApp).toBe('yes');
    
    // Check apple-mobile-web-app-capable
    const appleWebApp = await page.locator('meta[name="apple-mobile-web-app-capable"]').first().getAttribute('content');
    expect(appleWebApp).toBe('yes');
  });
});

