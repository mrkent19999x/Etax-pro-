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
      // Đợi redirect hoàn tất bằng cách đợi URL thay đổi
      await Promise.all([
        page.waitForURL(/\/login/, { timeout: 15000 }),
        page.goto(route)
      ]);
      console.log(`✅ ${route} redirects to login correctly`);
    }
  });

  test('Phase 2: Full Navigation Flow', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="mst-input"]', { timeout: 10000 });
    await page.getByTestId('mst-input').fill('00109202830');
    await page.getByTestId('password-input').fill('test123');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/\//, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // Verify on home page
    await expect(page).toHaveURL(/\//);
    await expect(page.getByText('TỬ XUÂN CHIẾN', { exact: true }).first()).toBeVisible({ timeout: 5000 });

    // Test sidebar navigation
    await page.click('button svg.lucide-menu');
    await expect(page.locator('text=TỬ XUÂN CHIẾN').first()).toBeVisible();
    
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
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="mst-input"]', { timeout: 10000 });
    await page.getByTestId('mst-input').fill('00109202830');
    await page.getByTestId('password-input').fill('test123');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/\//, { timeout: 15000 });
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
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId('mst-input').fill('00109202830');
    await page.getByTestId('password-input').fill('test123');
    await page.getByTestId('login-button').click();
    await page.waitForLoadState('networkidle');

    // Navigate to notifications (đợi redirect hoàn tất)
    await page.goto('/thong-bao', { waitUntil: 'networkidle' });
    // Check nếu bị redirect về login thì fail
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      throw new Error('Expected to be on /thong-bao but was redirected to login. User may not be logged in properly.');
    }
    
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
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="mst-input"]', { timeout: 10000 });
    await page.getByTestId('mst-input').fill('00109202830');
    await page.getByTestId('password-input').fill('test123');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/\//, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // Verify logged in state
    const isLoggedInAfterLogin = await page.evaluate(() => localStorage.getItem('isLoggedIn'));
    expect(isLoggedInAfterLogin).toBe('true');

    // Navigate to multiple pages
    const pagesToTest = ['/khai-thue', '/ho-tro', '/tien-ich'];
    
    for (const route of pagesToTest) {
      // Navigate và đợi page load (không bị redirect về login)
      await page.goto(route, { waitUntil: 'networkidle', timeout: 15000 });
      
      // Đợi một chút để đảm bảo redirect đã xảy ra (nếu có)
      await page.waitForTimeout(500);
      
      // Should stay on the page (not redirect to login)
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        throw new Error(`Expected to be on ${route} but was redirected to login. Auth persistence may not be working.`);
      }
      
      // Verify URL matches route
      expect(currentUrl).toContain(route);
      
      // LocalStorage should still have login state
      const isLoggedIn = await page.evaluate(() => localStorage.getItem('isLoggedIn'));
      expect(isLoggedIn).toBe('true');
      console.log(`✅ ${route} maintains login state`);
    }
  });
});

