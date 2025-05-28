import { expect, test } from '@playwright/test'

test('sign up successfully', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Nome do estabelecimento' })
    .fill('Pizza Shop')
  await page.getByRole('textbox', { name: 'Seu nome' }).fill('Jhon Doe')
  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('Jhondoe@example.com')
  await page.getByRole('textbox', { name: 'Seu celular' }).fill('1234151231')
  await page.getByRole('button', { name: 'Finalizar Cadastro' }).click()

  const toast = page.getByText('Restaurante cadastrado com sucesso.')
  await page.waitForTimeout(3000)
  await expect(toast).toBeVisible()
})

test('sign up with error', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page
    .getByRole('textbox', { name: 'Nome do estabelecimento' })
    .fill('Pizza Shop')
  await page.getByRole('textbox', { name: 'Seu nome' }).fill('Invalid name')
  await page
    .getByRole('textbox', { name: 'Seu e-mail' })
    .fill('Jhondoe@example.com')
  await page.getByRole('textbox', { name: 'Seu celular' }).fill('1234151231')
  await page.getByRole('button', { name: 'Finalizar Cadastro' }).click()

  const toast = page.getByText('Erro ao cadastrar restaurante.')

  await expect(toast).toBeVisible()

  await page.waitForTimeout(3000)
})

test('navigate to new login page', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page.getByRole('link', { name: 'Fazer login' }).click()
  await page.waitForTimeout(3000)
  expect(page.url()).toContain('/sign-in')
})
