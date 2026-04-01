import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.emptyCartBlock = page.locator('#empty_cart');
    this.continueShoppingLink = this.emptyCartBlock.getByRole('link', { name: 'here' });
    this.proceedToCheckoutButton = page.locator('.check_out');
    this.checkoutModal = page.locator('#checkoutModal');
    this.registerLoginLink = this.checkoutModal.getByRole('link', { name: 'Register / Login' });
    this.continueOnCartButton = this.checkoutModal.getByRole('button', {
      name: 'Continue On Cart',
    });
  }

  async open() {
    await this.page.goto('/view_cart');
  }

  async verifyCartPageOpened() {
    await expect(this.page).toHaveURL(/view_cart/);
    await expect(this.page.locator('#cart_info')).toBeVisible();
  }

  async verifyCartProductsNumber(count) {
    await expect(this.cartRows).toHaveCount(count);
  }

  async deleteFirstCartProduct() {
    const cartRow = this.cartRows.first();
    await cartRow.locator('.cart_quantity_delete').click();
  }

  async verifyEmptyCartBlock() {
    await expect(this.emptyCartBlock).toBeVisible();
    await expect(this.emptyCartBlock).toContainText('Cart is empty!');

    await expect(this.continueShoppingLink).toBeVisible();
    await expect(this.continueShoppingLink).toHaveAttribute('href', '/products');
  }

  async getCartProductDataByIndex(index) {
    const cartItem = this.cartRows.nth(index);

    const name = ((await cartItem.locator('.cart_description a').textContent()) ?? '').trim();
    const priceText = ((await cartItem.locator('.cart_price p').textContent()) ?? '').trim();
    const quantityText = (
      (await cartItem.locator('.cart_quantity button').textContent()) ?? ''
    ).trim();
    const totalText = ((await cartItem.locator('.cart_total_price').textContent()) ?? '').trim();

    const price = Number(priceText.replace('Rs. ', ''));
    const quantity = Number(quantityText);
    const total = Number(totalText.replace('Rs. ', ''));

    return { name, price, quantity, total };
  }

  async clickProceedToCheckout() {
    await expect(this.proceedToCheckoutButton).toBeVisible();
    await this.proceedToCheckoutButton.click();
  }

  async verifyCheckoutModalVisible() {
    await expect(this.checkoutModal).toBeVisible();
    await expect(this.checkoutModal.getByRole('heading', { name: 'Checkout' })).toBeVisible();
    await expect(this.checkoutModal).toContainText(
      'Register / Login account to proceed on checkout.',
    );
    await expect(this.registerLoginLink).toBeVisible();
  }

  async clickRegisterLoginLink() {
    await expect(this.registerLoginLink).toBeVisible();
    await this.registerLoginLink.click();
  }

  async clickContinueOnCart() {
    await expect(this.continueOnCartButton).toBeVisible();
    await this.continueOnCartButton.click();
  }

  async verifyCheckoutModalClosed() {
    await expect(this.checkoutModal).not.toBeVisible();
  }

  async verifyCheckoutPageOpened() {
    await expect(this.page).toHaveURL(/checkout/);
    await expect(this.page.locator('[data-qa="checkout-info"]')).toBeVisible();
    await expect(this.page.locator('#cart_info')).toBeVisible();
  }

  async clearCartIfNeeded() {
    await this.open();

    const count = await this.cartRows.count();

    for (let i = 0; i < count; i++) {
      await this.deleteFirstCartProduct();
    }
  }
}
