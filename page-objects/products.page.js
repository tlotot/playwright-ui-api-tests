import { expect } from '@playwright/test';

export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.productLink = page.getByRole('link', { name: 'Products' });
    this.allProductsHeading = page.getByRole('heading', { name: /all products/i });
    this.searchedProductsHeading = page.getByRole('heading', { name: /searched products/i });
    this.searchInput = page.getByPlaceholder('Search Product');
    this.searchButton = page.locator('#submit_search');
    this.productTitles = page.locator('.productinfo p');
    this.products = page.locator('.single-products');
    this.cartModal = page.locator('#cartModal');
    this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
    this.continueShoppingButton = this.cartModal.getByRole('button', { name: 'Continue Shopping' });
  }

  async open() {
    await this.page.goto('/');
    await this.productLink.click();
  }

  async verifyProductsPageOpened() {
    await expect(this.page).toHaveURL(/products/);
    await expect(this.allProductsHeading).toBeVisible();
  }

  async searchFor(product) {
    await this.searchInput.fill(product);
    await Promise.all([
      this.page.waitForURL(/\/products(\?search=.*)?$/),
      this.searchButton.click(),
    ]);
  }

  async verifySearchResultsVisible(product) {
    await expect(this.page).toHaveURL(/\/products(\?search=.*)?$/);
    await expect(this.productTitles.first()).toBeVisible();
    await expect(this.searchedProductsHeading).toBeVisible();
  }

  async verifyEmptySearchResults() {
    await expect(this.page).toHaveURL(/\/products/);
    await expect(this.productTitles).toHaveCount(0);
  }

  async getProductTitles() {
    return await this.productTitles.allTextContents();
  }

  async verifyEmptySearchShowsAllProducts() {
    await expect(this.page).toHaveURL(/\/products(\?search=)?$/);
    await expect(this.allProductsHeading).toBeVisible();
    expect(await this.productTitles.count()).toBeGreaterThan(0);
  }

  async addProductToCartByIndex(index) {
    const product = this.products.nth(index);
    await product.hover();
    const addToCartButton = product.locator('.product-overlay a.add-to-cart');
    await expect(addToCartButton).toBeVisible({ timeout: 10000 });
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    await expect(this.cartModal).toBeVisible({ timeout: 10000 });
  }

  async verifyAddToCartModalVisible() {
    await expect(this.cartModal).toBeVisible({ timeout: 10000 });
    await expect(this.cartModal.getByRole('heading')).toContainText(/added/i);
    await expect(this.cartModal).toContainText(/has been added to cart/i);
    await expect(this.viewCartLink).toBeVisible();
  }

  async clickViewCartLink() {
    await expect(this.viewCartLink).toBeVisible();
    await Promise.all([this.page.waitForURL(/\/view_cart/), this.viewCartLink.click()]);
  }

  async clickContinueShopping() {
    await this.verifyAddToCartModalVisible();
    await this.continueShoppingButton.click();
  }

  async getProductTitleByIndex(index) {
    const product = this.products.nth(index);
    return ((await product.locator('.productinfo p').textContent()) ?? '').trim();
  }

  async getProductPriceByIndex(index) {
    const product = this.products.nth(index);
    const priceText = ((await product.locator('.productinfo h2').textContent()) ?? '').trim();
    return Number(priceText.replace('Rs. ', ''));
  }
}
