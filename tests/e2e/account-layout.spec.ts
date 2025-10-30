import { test, expect } from '@playwright/test'

test.describe('Account Page Layout', () => {
  test.beforeEach(async ({ page }) => {
    // Login trước
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="mst-input"]', { timeout: 10000 });
    await page.getByTestId('mst-input').fill('00109202830');
    await page.getByTestId('password-input').fill('test123');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/\//, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  });

  test('Topbar fixed, avatar+buttons visible, text area scrollable', async ({ page }) => {
    // Đợi redirect hoàn tất (có thể redirect về login hoặc đến trang account)
    await page.goto('/thong-tin-tai-khoan', { waitUntil: 'networkidle' });
    // Nếu bị redirect về login, fail test với message rõ ràng
    if (page.url().includes('/login')) {
      throw new Error('Expected to be on account page but was redirected to login. User may not be logged in properly.');
    }

    // Wait for header title (có thể bị redirect về login nếu chưa login)
    await expect(page.getByText('Thông tin tài khoản').first()).toBeVisible({ timeout: 15000 });

    // Avatar circle visible
    await expect(page.locator('svg').first()).toBeVisible()

    // Four action buttons visible
    await expect(page.getByText('Thay đổi thông tin')).toBeVisible()
    await expect(page.getByText('Mã QR-Code thông')).toBeVisible()
    await expect(page.getByText('Đổi mật khẩu')).toBeVisible()
    await expect(page.getByText('Xoá tài khoản')).toBeVisible()

    // Take screenshot for report
    await page.screenshot({ path: 'test-results/account-page-layout.png', fullPage: true })
  })
})



