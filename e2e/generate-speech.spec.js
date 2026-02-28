/**
 * E2E: Flujo configurar caso → generar speech → ver resultado
 */

import { test, expect } from '@playwright/test'

test.describe('Flujo generar speech', () => {
  test('configurar caso, generar y ver resultado', async ({ page }) => {
    await page.goto('/')

    // Limpiar localStorage para estado limpio (evita RUT inválido persistido)
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    // Verificar que la app cargó
    await expect(page.getByText('SpeechCraft')).toBeVisible()

    // Completar organismo (primer select)
    await page.locator('select.f-select').first().selectOption('SERNAC')

    // Completar tipo de servicio (segundo select)
    await page.locator('select.f-select').nth(1).selectOption('MOVIL_EQUIPO')

    // Completar descripción del caso
    await page.getByPlaceholder(/cliente compró|smartwatch|pantalla/i).first().fill(
      'Cliente compró Smartwatch con falla de touch en pantalla'
    )

    // Generar speech
    await page.getByRole('button', { name: /generar speech/i }).click()

    // Esperar resultado (la generación toma ~1.2s)
    await expect(page.locator('.result-card')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.result-title')).toBeVisible()
  })

  test('botón generar deshabilitado sin campos obligatorios', async ({ page }) => {
    await page.goto('/')

    const genBtn = page.getByRole('button', { name: /generar speech/i })
    await expect(genBtn).toBeDisabled()
  })
})
