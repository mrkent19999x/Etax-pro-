import { test, expect } from '@playwright/test'

const LIVE = 'https://anhbao-373f3.web.app'

test.describe('Live smoke (PWA static, query routes)', () => {
  test('home loads', async ({ page }) => {
    await page.goto(LIVE)
    await expect(page).toHaveTitle(/eTax/i)
  })

  test('notifications list and open item with query id', async ({ page }) => {
    await page.goto(LIVE + '/thong-bao')
    // Click first card area by text snippet
    await page.getByText('Thông báo', { exact: false }).first().click({ trial: true }).catch(() => {})
    // Try clicking any card wrapper; fallback: click first link
    const links = page.locator('a[href*="/thong-bao?id="]').first()
    if (await links.count()) {
      await links.click()
      await expect(page).toHaveURL(/\/thong-bao\?id=/)
    }
  })

  test('obligations list and open item with query id', async ({ page }) => {
    await page.goto(LIVE + '/tra-cuu-nghia-vu-thue')
    // Click Tra cứu button (robust selector)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const traCuuBtn = page.getByRole('button', { name: /Tra cứu/i })
    if (await traCuuBtn.count()) {
      await traCuuBtn.first().click()
    } else {
      await page.locator('button:has-text("Tra cứu")').first().click()
    }
    // Click eye icon link
    const detail = page.locator('a[href*="/tra-cuu-nghia-vu-thue?id="]').first()
    await detail.click()
    await expect(page).toHaveURL(/\/tra-cuu-nghia-vu-thue\?id=/)
  })
})


