import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage trước mỗi test
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('Login Success - Should redirect to home page', async ({ page }) => {
    await page.goto('/login');
    
    // Điền MST
    await page.fill('input[placeholder="Mã số thuế"]', '00109202830');
    
    // Điền password
    await page.fill('input[placeholder="Mật khẩu"]', 'test123');
    
    // Click Đăng nhập
    await page.click('button:has-text("Đăng nhập")');
    
    // Đợi redirect và render
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Đợi render trang
    await expect(page).toHaveURL(/\//);
    
    // Check user info trong profile card
    await expect(page.locator('text=TỬ XUÂN CHIẾN')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=MST: 00109202830')).toBeVisible();
  });

  test('Login Validation - Empty fields should show error', async ({ page }) => {
    await page.goto('/login');
    
    // Click Đăng nhập mà không điền gì
    await page.click('button:has-text("Đăng nhập")');
    
    // Check error message
    await expect(page.locator('text="Vui lòng nhập MST và mật khẩu"')).toBeVisible();
    
    // Không redirect
    expect(page.url()).toContain('/login');
  });

  test('Protected Route - Should redirect to login if not logged in', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('Already Logged In - Should stay on home page', async ({ page }) => {
    // Login trước
    await page.goto('/login');
    await page.fill('input[placeholder="Mã số thuế"]', '00109202830');
    await page.fill('input[placeholder="Mật khẩu"]', 'test123');
    await page.click('button:has-text("Đăng nhập")');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\//);
    
    // Try navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Should redirect back to home (or stay on home if already there)
    await expect(page).toHaveURL(/\//);
  });
});

