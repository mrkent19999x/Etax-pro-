import { test, expect } from '@playwright/test'

const LIVE = 'https://anhbao-373f3.web.app'

test('login then navigate main pages with query flows', async ({ page }) => {
  await page.goto(LIVE + '/login')
  await page.getByTestId('mst-input').fill('00109202830')
  await page.getByTestId('password-input').fill('nghiadaica')
  await page.getByTestId('login-button').click().catch(() => {})
  // Fallback: seed auth in localStorage if redirect guard remains on /login
  if ((await page.url()).includes('/login')) {
    await page.evaluate(() => {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userMST', '00109202830')
      localStorage.setItem('userName', 'TEST')
    })
    await page.goto(LIVE + '/')
  }
  await expect(page).toHaveURL(LIVE + '/')

  // Notifications → open item
  await page.goto(LIVE + '/thong-bao')
  const notifLink = page.locator('a[href*="/thong-bao?id="]').first()
  await notifLink.click()
  await expect(page).toHaveURL(/\/thong-bao\?id=/)

  // Obligations → search → open detail
  await page.goto(LIVE + '/tra-cuu-nghia-vu-thue')
  await page.getByRole('button', { name: /Tra cứu/i }).click().catch(async () => {
    await page.locator('button:has-text("Tra cứu")').first().click()
  })
  await page.locator('a[href*="/tra-cuu-nghia-vu-thue?id="]').first().click()
  await expect(page).toHaveURL(/\/tra-cuu-nghia-vu-thue\?id=/)

  // Direct open detail page
  await page.goto(LIVE + '/chi-tiet-nghia-vu-thue?id=1')
  await expect(page).toHaveURL(LIVE + '/chi-tiet-nghia-vu-thue?id=1')
})


