import { test, expect } from '../setup';
import { ProductsPage } from '../../page-objects/products.page';
import { CartPage } from '../../page-objects/cart.page';
import { LoginPage } from '../../page-objects/login.page';
import { VALID_USER } from '../../test-data/users';

test.describe('Cart - guest user', () => {
  test('User can add a product to cart and see correct details', async ({ page }) => {
    const cartPage = new CartPage(page);
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await productsPage.addProductToCartByIndex(0);

    const productName = await productsPage.getProductTitleByIndex(0);
    const productPrice = await productsPage.getProductPriceByIndex(0);
    const expectedQuantity = 1;
    const expectedTotal = productPrice * expectedQuantity;

    await productsPage.verifyAddToCartModalVisible();
    await productsPage.clickViewCartLink();

    await cartPage.verifyCartPageOpened();
    await cartPage.verifyCartProductsNumber(1);

    const cartProduct = await cartPage.getCartProductDataByIndex(0);

    expect(cartProduct.name).toBe(productName);
    expect(cartProduct.price).toBe(productPrice);
    expect(cartProduct.quantity).toBe(expectedQuantity);
    expect(cartProduct.total).toBe(expectedTotal);
  });

  test('User can remove a product from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.open();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCartLink();

    await cartPage.verifyCartPageOpened();
    await cartPage.verifyCartProductsNumber(1);

    await cartPage.deleteFirstCartProduct();
    await cartPage.verifyCartProductsNumber(0);
    await cartPage.verifyEmptyCartBlock();
  });

  test('User can add multiple products to cart and see correct details', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.open();

    const firstProductName = await productsPage.getProductTitleByIndex(0);
    const secondProductName = await productsPage.getProductTitleByIndex(1);

    const firstProductPrice = await productsPage.getProductPriceByIndex(0);
    const secondProductPrice = await productsPage.getProductPriceByIndex(1);

    const expectedQuantity = 1;

    const firstProductTotalPriceExpected = firstProductPrice * expectedQuantity;
    const secondProductTotalPriceExpected = secondProductPrice * expectedQuantity;

    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickContinueShopping();
    await productsPage.addProductToCartByIndex(1);
    await productsPage.clickViewCartLink();

    await cartPage.verifyCartProductsNumber(2);

    const firstCartProduct = await cartPage.getCartProductDataByIndex(0);
    const secondCartProduct = await cartPage.getCartProductDataByIndex(1);

    expect(firstCartProduct.name).toBe(firstProductName);
    expect(secondCartProduct.name).toBe(secondProductName);

    expect(firstCartProduct.price).toBe(firstProductPrice);
    expect(secondCartProduct.price).toBe(secondProductPrice);

    expect(firstCartProduct.quantity).toBe(expectedQuantity);
    expect(secondCartProduct.quantity).toBe(expectedQuantity);

    expect(firstCartProduct.total).toBe(firstProductTotalPriceExpected);
    expect(secondCartProduct.total).toBe(secondProductTotalPriceExpected);
  });

  test('Guest user is prompted to log in when proceeding to checkout', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.open();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCartLink();

    await cartPage.clickProceedToCheckout();
    await cartPage.verifyCheckoutModalVisible();
  });

  test('Guest user can navigate to login from checkout modal', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);

    await productsPage.open();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCartLink();

    await cartPage.clickProceedToCheckout();
    await cartPage.verifyCheckoutModalVisible();
    await cartPage.clickRegisterLoginLink();

    await loginPage.verifyLoginPageOpened();
  });

  test('User sees empty cart after removing all products', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    await productsPage.open();

    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickContinueShopping();
    await productsPage.addProductToCartByIndex(1);
    await productsPage.clickViewCartLink();

    await cartPage.verifyCartProductsNumber(2);

    await cartPage.deleteFirstCartProduct();
    await cartPage.verifyCartProductsNumber(1);

    await cartPage.deleteFirstCartProduct();
    await cartPage.verifyCartProductsNumber(0);

    await cartPage.verifyEmptyCartBlock();
  });

  test('Guest user can close checkout modal and stay on cart page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    await productsPage.open();

    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCartLink();

    await cartPage.clickProceedToCheckout();
    await cartPage.verifyCheckoutModalVisible();
    await cartPage.clickContinueOnCart();

    await cartPage.verifyCheckoutModalClosed();
    await cartPage.verifyCartPageOpened();
  });
});

test.describe('Cart - logged-in user', () => {
  test('Logged-in user can proceed to checkout', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(VALID_USER.email, VALID_USER.password);
    await loginPage.verifyLoggedIn(VALID_USER.name);
    await cartPage.clearCartIfNeeded();

    await productsPage.open();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCartLink();

    await cartPage.clickProceedToCheckout();
    await cartPage.verifyCheckoutPageOpened();
  });

  test('Cart persists after login from checkout flow', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);

    await productsPage.open();

    const productName = await productsPage.getProductTitleByIndex(0);

    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickViewCartLink();
    await cartPage.clickProceedToCheckout();
    await cartPage.verifyCheckoutModalVisible();
    await cartPage.clickRegisterLoginLink();

    await loginPage.verifyLoginPageOpened();
    await loginPage.login(VALID_USER.email, VALID_USER.password);
    await loginPage.verifyLoggedIn(VALID_USER.name);

    await cartPage.open();
    await cartPage.verifyCartPageOpened();
    await cartPage.verifyCartProductsNumber(1);

    const cartProduct = (await cartPage.getCartProductDataByIndex(0)).name;
    expect(cartProduct).toBe(productName);

    await cartPage.deleteFirstCartProduct();
  });
});
