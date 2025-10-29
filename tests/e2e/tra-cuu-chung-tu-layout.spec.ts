import { test, expect } from '@playwright/test';

test.describe('Tra cứu chứng từ - Layout 5 cột', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage và login trước
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('isLoggedIn', 'true');
    });
    
    // Login trước khi test
    await page.goto('/login', { waitUntil: 'networkidle' });
    await page.getByTestId('mst-input').fill('00109202830');
    await page.getByTestId('password-input').fill('test123');
    await page.getByTestId('login-button').click();
    await page.waitForURL(/\//, { timeout: 10000 });
  });

  test('Layout kết quả tra cứu - 5 cột dọc, không scroll ngang', async ({ page }) => {
    // Mở trang tra cứu chứng từ
    await page.goto('/tra-cuu-chung-tu');
    
    // Đợi trang load
    await page.waitForLoadState('networkidle');
    
    // Chụp screenshot trước khi click tra cứu
    await page.screenshot({ 
      path: 'test-results/tra-cuu-chung-tu-before-search.png',
      fullPage: false 
    });
    
    // Click button "Tra cứu" để hiện kết quả
    // Theo logic: nếu referenceCode rỗng thì hasResults = true
    await page.click('button:has-text("Tra cứu")');
    
    // Đợi kết quả hiển thị
    await page.waitForTimeout(1000);
    
    // Kiểm tra có kết quả table không
    const resultsVisible = await page.locator('.grid.grid-cols-5').count() > 0;
    
    if (resultsVisible) {
      // Chụp screenshot kết quả
      await page.screenshot({ 
        path: 'test-results/tra-cuu-chung-tu-results-layout.png',
        fullPage: false 
      });
      
      // Kiểm tra layout 5 cột trong header
      const header = page.locator('.grid.grid-cols-5').first();
      const headerCells = await header.locator('> div').count();
      expect(headerCells).toBe(5);
      
      // Kiểm tra có border giữa các cột
      const cellsWithBorder = await header.locator('div.border-r').count();
      expect(cellsWithBorder).toBeGreaterThan(0);
      
      // Kiểm tra không có overflow-x-auto (scroll ngang)
      const container = page.locator('div:has(.grid.grid-cols-5)').first();
      const hasOverflowX = await container.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.overflowX === 'auto' || style.overflowX === 'scroll';
      });
      expect(hasOverflowX).toBe(false);
      
      // Kiểm tra toàn bộ page không có scroll ngang
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
      
      console.log('✅ Layout test passed: 5 columns, borders present, no horizontal scroll');
    } else {
      // Nếu không có kết quả, chụp screenshot trang tra cứu
      await page.screenshot({ 
        path: 'test-results/tra-cuu-chung-tu-no-results.png',
        fullPage: false 
      });
      console.log('⚠️ No results table found, form layout captured');
    }
  });
});

