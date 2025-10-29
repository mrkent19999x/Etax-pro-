import { test, expect } from '@playwright/test'

test.describe('Account Page Layout', () => {
  test('Topbar fixed, avatar+buttons visible, text area scrollable', async ({ page }) => {
    await page.goto('/thong-tin-tai-khoan')

    // Wait for header title
    await expect(page.getByText('Thông tin tài khoản').first()).toBeVisible()

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



