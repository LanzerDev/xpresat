import { test, expect } from '@playwright/test'

test.describe('XpresaT Landing Page E2E Tests', () => {
  // We point the test to the Astro dev/build server (typically on 4321)
  const landingUrl = 'http://localhost:4321'

  test('should load the landing page successfully and display key sections', async ({ page }) => {
    // Navigate to the landing page
    await page.goto(landingUrl)

    // Check document title
    await expect(page).toHaveTitle(/XpresaT/)

    // Check navbar brand logo
    const logo = page.locator('#navbar .logo')
    await expect(logo).toBeVisible()
    await expect(logo).toContainText('XpresaT')

    // Check for essential page anchors/sections
    await expect(page.locator('#about')).toBeVisible()
    await expect(page.locator('#services')).toBeVisible()
    await expect(page.locator('#process')).toBeVisible()
    await expect(page.locator('#contacto')).toBeVisible()

    // Check contact direct links in footer
    const whatsappBtn = page.locator('.whatsapp-sticky')
    await expect(whatsappBtn).toBeVisible()
    await expect(whatsappBtn).toHaveAttribute('href', /wa\.me/)
  })

  test('should open project modal with Bento Grid on project card click', async ({ page }) => {
    await page.goto(landingUrl)

    // Wait for project cards to render
    const projectCard = page.locator('.project-card').first()
    await expect(projectCard).toBeVisible()

    // Retrieve project title from card to compare with modal title
    const cardTitle = await projectCard.locator('.card-title').innerText()

    // Trigger modal opening by clicking the project card
    await projectCard.click()

    // Check if modal container is displayed
    const modal = page.locator('#project-modal')
    await expect(modal).toHaveClass(/open/)
    await expect(modal).toHaveAttribute('aria-hidden', 'false')

    // Verify bento layout title inside modal matches project card
    const modalTitle = page.locator('#modal-project-title')
    await expect(modalTitle).toBeVisible()
    await expect(modalTitle).toHaveText(cardTitle)

    // Verify modal primary viewport contains media (img or iframe)
    const mediaViewport = page.locator('#modal-primary-media')
    await expect(mediaViewport).toBeVisible()
    const mediaElement = mediaViewport.locator('img, video, iframe')
    await expect(mediaElement.first()).toBeVisible()

    // Close the modal using the close button
    const closeBtn = page.locator('#project-modal .modal-close')
    await closeBtn.click()

    // Verify modal is hidden
    await expect(modal).not.toHaveClass(/open/)
    await expect(modal).toHaveAttribute('aria-hidden', 'true')
  })
})
