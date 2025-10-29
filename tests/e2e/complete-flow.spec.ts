import { test, expect } from '@playwright/test';

test.describe('Complete Flow Tests - All Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('Phase 1: Auth Guard - Redirect from protected pages', async ({ page }) => {
    const protectedPages = [
      '/',
      '/khai-thue',
      '/ho-tro',
      '/tien-ich',
      '/tra-cuu-chung-tu',
      '/tra-cuu-nghia-vu-thue',
      '/dang-ky-thue',
      '/ho-so-dang-ky-thue',
      '/hoa-don-dien-tu',
      '/ho-tro-quyet-toan',
      '/ho-so-quyet-toan-thue',
      '/tra-cuu-thong-tin-nguoi-phu-thuoc',
      '/tra-cuu-thong-tin-quyet-toan',
      '/nhom-chuc-nang-nop-thue',
      '/thiet-lap-ca-nhan',
      '/thong-bao',
      '/thong-tin-tai-khoan'
    ];

    for (const route of protectedPages) {
      await page.goto(route);
      // Should redirect to login if not logged in
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
      console.log(`✅ ${route} redirects to login correctly`);
    }
  });

  test('Phase 2: Full Navigation Flow', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Mã số thuế"]', '00109202830');
    await page.fill('input[placeholder="Mật khẩu"]', 'test123');
    await page.click('button:has-text("Đăng nhập")');
    await page.waitForLoadState('networkidle');
    
    // Verify on home page
    await expect(page).toHaveURL(/\//);
    await expect(page.locator('text=TỬ XUÂN CHIẾN')).toBeVisible({ timeout: 5000 });

    // Test sidebar navigation
    await page.click('button svg.lucide-menu');
    await expect(page.locator('text=TỬ XUÂN CHIẾN')).toBeVisible();
    
    // Navigate to different pages via sidebar
    const sidebarRoutes = [
      { link: 'Khai thuế', url: '/khai-thue' },
      { link: 'Hỗ trợ', url: '/ho-tro' },
      { link: 'Tiện ích', url: '/tien-ich' },
    ];

    for (const route of sidebarRoutes) {
      await page.click(`button:has-text("${route.link}")`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(new RegExp(route.url));
      console.log(`✅ Navigated to ${route.link}`);
      
      // Go back
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
  });

  test('Phase 3: Home Grid Navigation', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Mã số thuế"]', '00109202830');
    await page.fill('input[placeholder="Mật khẩu"]', 'test123');
    await page.click('button:has-text("Đăng nhập")');
    await page.waitForLoadState('networkidle');

    // Test service grid clicks
    const gridRoutes = [
      { text: 'Tra cứu thông báo', url: '/thong-bao' },
      { text: 'Hoá đơn điện tử', url: '/hoa-don-dien-tu' },
    ];

    for (const route of gridRoutes) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Try to click (might be emoji based)
      const link = page.locator(`a[href="${route.url}"]`).first();
      if (await link.isVisible()) {
        await link.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(new RegExp(route.url));
        console.log(`✅ Clicked ${route.text}`);
      }
    }
  });

  test('Phase 4: Notification Flow', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[placeholder="Mã số thuế"]', '00109202830');
    await page.fill('input[placeholder="Mật khẩu"]', 'test123');
    await page.click('button:has-text("Đăng nhập")');
    await page.waitForLoadState('networkidle');

    // Navigate to notifications
    await page.goto('/thong-bao');
    await page.waitForLoadState('networkidle');
    
    // Check if page loads
    await expect(page.locator('text=Thông báo')).toBeVisible();
    
    // Try to click first notification
    const notificationLink = page.locator('a[href^="/thong-bao/"]').first();
    if (await notificationLink.isVisible()) {
      await notificationLink.click();
      await page.waitForLoadState('networkidle');
      console.log('✅ Notification detail page loaded');
    }
  });

  test('Phase 5: Auth persistence across navigation', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[placeholder="Mã số thuế"]', '00109202830');
    await page.fill('input[placeholder="Mật khẩu"]', 'test123');
    await page.click('button:has-text("Đăng nhập")');
    await page.waitForLoadState('networkidle');

    // Navigate to multiple pages
    const pagesToTest = ['/khai-thue', '/ho-tro', '/tien-ich'];
    
    for (const route of pagesToTest) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      // Should stay on the page (not redirect to login)
      await expect(page).toHaveURL(new RegExp(route));
      
      // LocalStorage should still have login state
      const isLoggedIn = await page.evaluate(() => localStorage.getItem('isLoggedIn'));
      expect(isLoggedIn).toBe('true');
      console.log(`✅ ${route} maintains login state`);
    }
  });
});

