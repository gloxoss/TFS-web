/**
 * Quote Flow E2E Test
 * 
 * Tests the critical user journey:
 * Browse catalog → Add item to cart → Submit quote request
 * 
 * Per cinema-journeys.md User Journey 2: Equipment Browsing & Quote Request
 */

import { test, expect } from '@playwright/test'

// Test configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
const DEFAULT_LANG = 'en'

test.describe('Quote Flow Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing cart state
    await page.goto(`${BASE_URL}/${DEFAULT_LANG}`)
    await page.evaluate(() => {
      localStorage.removeItem('tfs-cart-storage')
    })
  })

  test('user can browse catalog and view product details', async ({ page }) => {
    // Navigate to equipment catalog
    await page.goto(`${BASE_URL}/${DEFAULT_LANG}/equipment`)
    
    // Wait for products to load
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible({ timeout: 10000 })
    
    // Check that products are displayed
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards.first()).toBeVisible()
    
    // Click on first product
    await productCards.first().click()
    
    // Verify we're on product detail page
    await expect(page.locator('[data-testid="product-detail"]')).toBeVisible({ timeout: 5000 })
  })

  test('user can add item to cart from product detail page', async ({ page }) => {
    // Navigate to equipment catalog
    await page.goto(`${BASE_URL}/${DEFAULT_LANG}/equipment`)
    
    // Wait for products to load and click first one
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards.first()).toBeVisible({ timeout: 10000 })
    await productCards.first().click()
    
    // Wait for product detail page
    await expect(page.locator('[data-testid="product-detail"]')).toBeVisible({ timeout: 5000 })
    
    // Fill in rental dates (using date inputs)
    const startDateInput = page.locator('[data-testid="start-date-input"], input[name="startDate"], input[type="date"]').first()
    const endDateInput = page.locator('[data-testid="end-date-input"], input[name="endDate"], input[type="date"]').last()
    
    // Set dates to next week
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 7)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 10)
    
    await startDateInput.fill(startDate.toISOString().split('T')[0])
    await endDateInput.fill(endDate.toISOString().split('T')[0])
    
    // Click add to cart button
    const addToCartButton = page.locator('[data-testid="add-to-cart"], button:has-text("Add to Quote"), button:has-text("Add to Cart")')
    await addToCartButton.click()
    
    // Verify cart badge shows item count
    const cartBadge = page.locator('[data-testid="cart-count"], [data-testid="cart-button"] span')
    await expect(cartBadge).toContainText('1')
  })

  test('user can view and manage cart', async ({ page }) => {
    // Add an item to cart first (via direct navigation with query params or localStorage setup)
    await page.goto(`${BASE_URL}/${DEFAULT_LANG}/cart`)
    
    // For empty cart, should show empty state
    await expect(page.locator('text=Your cart is empty, text=empty').first()).toBeVisible({ timeout: 5000 })
    
    // Navigate to equipment and add item
    await page.goto(`${BASE_URL}/${DEFAULT_LANG}/equipment`)
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 })
    await page.locator('[data-testid="product-card"]').first().click()
    
    // Set dates and add to cart
    await expect(page.locator('[data-testid="product-detail"]')).toBeVisible({ timeout: 5000 })
    
    const startDateInput = page.locator('input[type="date"]').first()
    const endDateInput = page.locator('input[type="date"]').last()
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 7)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 10)
    
    if (await startDateInput.isVisible()) {
      await startDateInput.fill(startDate.toISOString().split('T')[0])
      await endDateInput.fill(endDate.toISOString().split('T')[0])
    }
    
    await page.locator('button:has-text("Add to Quote"), button:has-text("Add to Cart")').first().click()
    
    // Navigate to cart page
    await page.goto(`${BASE_URL}/${DEFAULT_LANG}/cart`)
    
    // Verify cart has items
    await expect(page.locator('[data-testid="cart-item"], [class*="cart-item"]').first()).toBeVisible({ timeout: 5000 })
  })

  test('user can complete quote request form', async ({ page }) => {
    // This test requires a populated cart
    // First, set up cart via localStorage
    await page.goto(`${BASE_URL}/${DEFAULT_LANG}`)
    
    // Simulate adding item to cart via localStorage
    const mockCartData = {
      state: {
        items: [{
          id: 'test_item_1',
          product: {
            id: 'prod_test',
            name: 'Test Camera',
            nameEn: 'Test Camera',
            nameFr: 'Caméra Test',
            slug: 'test-camera',
            categoryId: 'cat_1',
            dailyRate: 100,
            stockTotal: 5,
            stockAvailable: 5,
            isAvailable: true,
          },
          quantity: 1,
          dates: {
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          },
        }],
        globalDates: null,
      },
      version: 0,
    }
    
    await page.evaluate((data) => {
      localStorage.setItem('tfs-cart-storage', JSON.stringify(data))
    }, mockCartData)
    
    // Navigate to quote page
    await page.goto(`${BASE_URL}/${DEFAULT_LANG}/quote`)
    
    // Step 1: Contact Information
    await expect(page.locator('text=Contact, text=contact').first()).toBeVisible({ timeout: 5000 })
    
    await page.fill('input[name="firstName"]', 'John')
    await page.fill('input[name="lastName"]', 'Doe')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('input[name="phone"]', '+1 555 123 4567')
    
    // Click Next
    await page.locator('button:has-text("Next")').click()
    
    // Step 2: Project Details
    await expect(page.locator('text=Project, text=project').first()).toBeVisible({ timeout: 3000 })
    
    // Select project type
    const projectTypeSelect = page.locator('select[name="projectType"]')
    if (await projectTypeSelect.isVisible()) {
      await projectTypeSelect.selectOption('commercial')
    }
    
    // Select delivery preference
    const deliverySelect = page.locator('select[name="deliveryPreference"]')
    if (await deliverySelect.isVisible()) {
      await deliverySelect.selectOption('pickup')
    }
    
    // Click Next
    await page.locator('button:has-text("Next")').click()
    
    // Step 3: Review
    await expect(page.locator('text=Review, text=review').first()).toBeVisible({ timeout: 3000 })
    
    // Accept terms
    const termsCheckbox = page.locator('input[name="acceptTerms"]')
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.check()
    }
    
    // Note: We don't actually submit to avoid creating test data in prod
    // Just verify the submit button is available
    await expect(page.locator('button:has-text("Submit")')).toBeVisible()
  })

  test('empty cart shows appropriate message on quote page', async ({ page }) => {
    // Clear cart
    await page.goto(`${BASE_URL}/${DEFAULT_LANG}`)
    await page.evaluate(() => {
      localStorage.removeItem('tfs-cart-storage')
    })
    
    // Navigate to quote page
    await page.goto(`${BASE_URL}/${DEFAULT_LANG}/quote`)
    
    // Should show empty cart message or redirect
    const emptyMessage = page.locator('text=empty, text=Empty, text=no items, text=No items')
    const cartLink = page.locator('a[href*="equipment"], a[href*="cart"]')
    
    // Either empty message or back link should be visible
    await expect(emptyMessage.or(cartLink).first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Internationalization', () => {
  test('catalog page works in French', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/equipment`)
    
    // Check French content is present
    await expect(page.locator('text=Catalogue, text=équipement').first()).toBeVisible({ timeout: 10000 })
  })

  test('cart page works in French', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr/cart`)
    
    // Check French content
    await expect(page.locator('text=panier, text=devis, text=vide').first()).toBeVisible({ timeout: 5000 })
  })
})
