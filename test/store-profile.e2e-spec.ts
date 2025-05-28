import { expect, test } from '@playwright/test'

test('update profile successfully', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('junior-dk555@hotmail.com')

  await page.getByRole('button', { name: 'Acessar painel' }).click()
  await page.getByRole('link', { name: 'Clique aqui para acessar' }).click()
  expect(page.url()).toContain('/localhost:3000/')
  await page.getByRole('button', { name: 'Pizza Shop' }).click()
  await page.getByRole('menuitem', { name: 'Perfil da loja' }).click()
  await page.getByRole('textbox', { name: 'Nome' }).fill('Pizza Shop')
  await page
    .getByRole('textbox', { name: 'Descrição' })
    .fill('Pizzaria description')

  await page.getByRole('button', { name: 'Salvar' }).click()
  await page.waitForLoadState('networkidle')

  const toast = page.getByText('Perfil atualizado com sucesso!')

  await expect(toast).toBeVisible()

  await page.getByRole('button', { name: 'Close' }).click()

  await expect(page.getByRole('button', { name: 'Pizza Shop' })).toBeVisible()

  await page.waitForTimeout(3000)
})
