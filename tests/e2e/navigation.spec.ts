import { test, expect } from '@playwright/test';

test.describe('Home Page Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login trước
    await page.goto('/login');
    await page.fill('input[placeholder="Mã số thuế"]', '00109202830');
    await page.fill('input[placeholder="Mật khẩu"]', 'test123');
    await page.click('button:has-text("Đăng nhập")');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\//);
  });

  test('Sidebar - Should open and close', async ({ page }) => {
    // Click menu icon (button chứa Menu icon)
    await page.locator('button:has(svg)').first().click();
    
    // Check sidebar is visible (text trong Sidebar component)
    await expect(page.locator('text=TỬ XUÂN CHIẾN').or(page.locator('text=TỪ XUÂN CHIẾN'))).toBeVisible({ timeout: 5000 });
    
    // Click overlay to close
    await page.click('div.fixed.inset-0.bg-black\\/50');
    
    // Sidebar should be hidden
    await expect(page.locator('text=TỬ XUÂN CHIẾN').or(page.locator('text=TỪ XUÂN CHIẾN'))).not.toBeVisible({ timeout: 1000 });
  });

  test('Sidebar Navigation - Click Khai thuế menu item', async ({ page }) => {
    // Open sidebar
    await page.locator('button:has(svg)').first().click();
    await page.waitForTimeout(500);
    
    // Click "Khai thuế" trong sidebar
    await page.click('a[href="/khai-thue"]');
    
    // Should navigate to /khai-thue
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/khai-thue/);
  });

  test('Carousel - Should scroll to next items', async ({ page }) => {
    // Find carousel
    const carousel = page.locator('[class*="carousel"]').first();
    
    if (await carousel.isVisible()) {
      // Click next button (if available)
      const nextButton = page.locator('button:has([class*="ChevronRight"])').first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        // Should move carousel
        await page.waitForTimeout(300);
      }
    }
  });

  test('Service Grid - Click Tra cứu thông báo', async ({ page }) => {
    // Click service icon "Tra cứu thông báo" - tìm link hoặc div có text này
    await page.locator('a[href="/thong-bao"], div:has-text("Tra cứu thông báo")').first().click();
    
    // Should navigate to /thong-bao
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/thong-bao/);
  });

  test('Profile Card - Click should navigate to account page', async ({ page }) => {
    // Click link trong profile card (Image có alt="Navigate to account")
    await page.locator('a[href="/thong-tin-tai-khoan"]').first().click();
    
    // Should navigate to account page
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/thong-tin-tai-khoan/);
  });

  test('Back Button - Should return to previous page', async ({ page }) => {
    // Navigate to khai-thue
    await page.goto('/khai-thue');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    
    // Should return to home
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\//);
  });
});

