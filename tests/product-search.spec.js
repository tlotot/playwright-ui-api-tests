import { test, expect } from './setup';
import { ProductsPage } from '../page-objects/products.page';

const SEARCH_PRODUCT = 'blue top';
const SEARCH_PRODUCT_2 = 'jeans';
const SEARCH_PRODUCT_UPPER_CASE = 'Blue Top';
const SEARCH_PRODUCT_LOWER_CASE = 'blue top';
const INVALID_PRODUCT_NAME = 'invalid_product_123456';

test.describe('Product search', () => {
  test('Product search displays matching results', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await productsPage.verifyProductsPageOpened();
    await productsPage.searchFor(SEARCH_PRODUCT);
    await productsPage.verifySearchResultsVisible(SEARCH_PRODUCT);

    const titles = await productsPage.getProductTitles();
    const query = SEARCH_PRODUCT.toLowerCase();

    for (const el of titles) {
      expect(el.toLowerCase()).toContain(query);
    }
  });

  test('Search with no results', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await productsPage.searchFor(INVALID_PRODUCT_NAME);

    await productsPage.verifyEmptySearchResults(INVALID_PRODUCT_NAME);
  });

  test('Search results update when user changes query', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await productsPage.searchFor(SEARCH_PRODUCT);

    const titlesBefore = await productsPage.getProductTitles();
    const query = SEARCH_PRODUCT.toLowerCase();

    for (const el of titlesBefore) {
      expect(el.toLowerCase()).toContain(query);
    }

    await productsPage.searchFor(SEARCH_PRODUCT_2);

    const titlesAfter = await productsPage.getProductTitles();
    const query2 = SEARCH_PRODUCT_2.toLowerCase();

    for (const el of titlesAfter) {
      expect(el.toLowerCase()).toContain(query2);
    }

    expect(titlesBefore).not.toEqual(titlesAfter);
  });

  test('Search with empty input', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await productsPage.searchFor('');
    await productsPage.verifyEmptySearchShowsAllProducts();
  });

  test('Search is case-insensitive', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await productsPage.searchFor(SEARCH_PRODUCT_UPPER_CASE);
    await productsPage.verifySearchResultsVisible(SEARCH_PRODUCT_UPPER_CASE);
    const titlesUpperCase = await productsPage.getProductTitles();

    await productsPage.searchFor(SEARCH_PRODUCT_LOWER_CASE);
    await productsPage.verifySearchResultsVisible(SEARCH_PRODUCT_LOWER_CASE);
    const titlesLowerCase = await productsPage.getProductTitles();

    expect([...titlesUpperCase].sort()).toEqual([...titlesLowerCase].sort());
  });
});
