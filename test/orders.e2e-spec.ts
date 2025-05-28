import { expect, test } from '@playwright/test'

test('list orders', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('junior-dk555@hotmail.com')

  await page.getByRole('button', { name: 'Acessar painel' }).click()
  await page.getByRole('link', { name: 'Clique aqui para acessar' }).click()
  expect(page.url()).toContain('/localhost:3000/')

  await page.getByRole('link', { name: 'Pedidos' }).click()
  expect(page.url()).toContain('/localhost:3000/orders')

  await page.waitForTimeout(2000)
})

test('paginate orders', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('junior-dk555@hotmail.com')

  await page.getByRole('button', { name: 'Acessar painel' }).click()
  await page.getByRole('link', { name: 'Clique aqui para acessar' }).click()
  expect(page.url()).toContain('/localhost:3000/')

  await page.getByRole('link', { name: 'Pedidos' }).click()
  await expect(page.url()).toContain('/localhost:3000/orders')

  await page.getByRole('button', { name: 'Próxima página' }).click()

  await expect(page.getByText('Página 2 de')).toBeVisible()

  await page.getByRole('button', { name: 'Ultima página' }).click()

  await expect(page.getByText('Página 20 de 20')).toBeVisible()

  await page.getByRole('button', { name: 'Página anterior' }).click()

  await expect(page.getByText('Página 19 de 20')).toBeVisible()

  await page.getByRole('button', { name: 'Primeira página' }).click()

  await expect(page.getByText('Página 1 de 20')).toBeVisible()

  await page.waitForTimeout(3000)
})
