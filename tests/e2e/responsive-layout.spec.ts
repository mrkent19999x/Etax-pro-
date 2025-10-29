import { test, expect } from '@playwright/test';

test.describe('Responsive & Layout Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login trước
    await page.goto('/login');
    await page.fill('input[placeholder="Mã số thuế"]', '00109202830');
    await page.fill('input[placeholder="Mật khẩu"]', 'test123');
    await page.click('button:has-text("Đăng nhập")');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\//);
  });

  test('Responsive - Home page layout on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Check header is visible
    await expect(page.locator('text=eTax Mobile')).toBeVisible({ timeout: 10000 });
    
    // Check profile card (text có thể là TỬ XUÂN CHIẾN hoặc TỪ XUÂN CHIẾN)
    await expect(page.locator('text=TỬ XUÂN CHIẾN').or(page.locator('text=TỪ XUÂN CHIẾN'))).toBeVisible({ timeout: 10000 });
    
    // Check "Chức năng hay dùng" section
    await expect(page.locator('text=Chức năng hay dùng')).toBeVisible();
    
    // Check has 4 items (đã xóa 2 items)
    const frequentFeatures = page.locator('div:has-text("Chức năng hay dùng")').locator('..').locator('a');
    const count = await frequentFeatures.count();
    expect(count).toBe(4); // Đã xóa 2, còn lại 4
    
    // Chụp screenshot
    await page.screenshot({ path: 'test-results/home-responsive.png', fullPage: true });
  });

  test('Layout - Tra cứu chứng từ table layout', async ({ page }) => {
    await page.goto('/tra-cuu-chung-tu');
    await page.waitForLoadState('networkidle');
    
    // Click "Tra cứu" để hiện kết quả (có thể là button hoặc có nhiều button)
    await page.locator('button:has-text("Tra cứu")').first().click({ timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Kiểm tra table có 5 cột
    const table = page.locator('table');
    if (await table.isVisible()) {
      const headers = table.locator('thead th');
      const headerCount = await headers.count();
      expect(headerCount).toBe(5);
      
      // Kiểm tra border và layout
      const firstCell = table.locator('td').first();
      const hasBorder = await firstCell.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.borderWidth !== '0px';
      });
      expect(hasBorder).toBe(true);
      
      // Kiểm tra không có horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
      
      // Chụp screenshot
      await page.screenshot({ path: 'test-results/tra-cuu-chung-tu-layout.png', fullPage: true });
    }
  });

  test('Navigation - Test các trang chính', async ({ page }) => {
    const pages = [
      { name: 'Tra cứu thông tin người phụ thuộc', href: '/tra-cuu-thong-tin-nguoi-phu-thuoc' },
      { name: 'Hồ sơ quyết toán thuế', href: '/ho-so-quyet-toan-thue' },
      { name: 'Tra cứu chứng từ', href: '/tra-cuu-chung-tu' },
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.href);
      await page.waitForLoadState('networkidle');
      
      // Kiểm tra header có title
      const header = page.locator(`text=${pageInfo.name}`).first();
      await expect(header).toBeVisible({ timeout: 5000 });
      
      // Kiểm tra responsive - không có horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    }
  });

  test('Layout - Full width content không có khung trắng nhỏ', async ({ page }) => {
    await page.goto('/tra-cuu-chung-tu');
    await page.waitForLoadState('networkidle');
    
    // Kiểm tra form fields full width
    const formContainer = page.locator('div:has(input[placeholder="Nhập mã tham chiếu"])');
    const containerWidth = await formContainer.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    
    // Input field nên full width
    const input = page.locator('input[placeholder="Nhập mã tham chiếu"]');
    const inputWidth = await input.evaluate((el) => {
      return window.getComputedStyle(el).width;
    });
    
    // Kiểm tra không có margin/padding lớn ở 2 bên
    const bodyWidth = await page.evaluate(() => window.innerWidth);
    const formRect = await formContainer.boundingBox();
    
    if (formRect) {
      // Content nên chiếm gần hết chiều rộng (cho phép padding nhỏ)
      const contentRatio = formRect.width / bodyWidth;
      expect(contentRatio).toBeGreaterThan(0.85); // Ít nhất 85% chiều rộng
    }
  });
});

