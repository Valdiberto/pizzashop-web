import { expect, test } from '@playwright/test'

test('display day orders amount metric', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('junior-dk555@hotmail.com')

  await page.getByRole('button', { name: 'Acessar painel' }).click()
  await page.getByRole('link', { name: 'Clique aqui para acessar' }).click()
  expect(page.url()).toContain('/localhost:3000/')

  await expect(page.getByText('3', { exact: true })).toBeVisible()
  await expect(page.getByText('-57.14% em relação a ontem')).toBeVisible()
  await page.waitForTimeout(2000)
})

test('display month orders amount metric', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('junior-dk555@hotmail.com')

  await page.getByRole('button', { name: 'Acessar painel' }).click()
  await page.getByRole('link', { name: 'Clique aqui para acessar' }).click()
  expect(page.url()).toContain('/localhost:3000/')

  await expect(page.getByText('138', { exact: true })).toBeVisible()
  await expect(page.getByText('+122.58% em relação ao mês')).toBeVisible()
  await page.waitForTimeout(2000)
})

test('display month canceled amount metric', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('junior-dk555@hotmail.com')

  await page.getByRole('button', { name: 'Acessar painel' }).click()
  await page.getByRole('link', { name: 'Clique aqui para acessar' }).click()
  expect(page.url()).toContain('/localhost:3000/')

  await expect(
    page
      .locator('div')
      .filter({ hasText: /^\+138\.86% em relação ao mês passado$/ })
      .getByRole('paragraph'),
  ).toBeVisible()

  await page.waitForTimeout(2000)
})

test('display month revenue amount metric', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('junior-dk555@hotmail.com')

  await page.getByRole('button', { name: 'Acessar painel' }).click()
  await page.getByRole('link', { name: 'Clique aqui para acessar' }).click()
  expect(page.url()).toContain('/localhost:3000/')

  await expect(page.getByText('R$ 2.191,51')).toBeVisible()
  await expect(
    page.getByText('+138.86% em relação ao mês').first(),
  ).toBeVisible()

  await page.waitForTimeout(2000)
})
