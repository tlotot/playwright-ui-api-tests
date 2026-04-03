import { test, expect } from '../setup';
import { ProductsPage } from '../../page-objects/products.page';
import { SEARCH_DATA } from '../../test-data/search-data';

test.describe('Product search', () => {
  test('Product search displays matching results', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await productsPage.verifyProductsPageOpened();
    await productsPage.searchFor(SEARCH_DATA.validSearch);
    await productsPage.verifySearchResultsVisible(SEARCH_DATA.validSearch);

    const titles = await productsPage.getProductTitles();
    const query = SEARCH_DATA.validSearch.toLowerCase();

    for (const el of titles) {
      expect(el.toLowerCase()).toContain(query);
    }
  });

  test('Search with no results', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await productsPage.searchFor(SEARCH_DATA.invalidSearch);

    await productsPage.verifyEmptySearchResults();
  });

  test('Search results update when user changes query', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await productsPage.searchFor(SEARCH_DATA.validSearch);

    const titlesBefore = await productsPage.getProductTitles();
    const query = SEARCH_DATA.validSearch.toLowerCase();

    for (const el of titlesBefore) {
      expect(el.toLowerCase()).toContain(query);
    }

    await productsPage.searchFor(SEARCH_DATA.secondSearch);

    const titlesAfter = await productsPage.getProductTitles();
    const query2 = SEARCH_DATA.secondSearch.toLowerCase();

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
    await productsPage.searchFor(SEARCH_DATA.upperCaseSearch);
    await productsPage.verifySearchResultsVisible(SEARCH_DATA.upperCaseSearch);
    const titlesUpperCase = await productsPage.getProductTitles();

    await productsPage.searchFor(SEARCH_DATA.validSearch);
    await productsPage.verifySearchResultsVisible(SEARCH_DATA.validSearch);
    const titlesLowerCase = await productsPage.getProductTitles();

    expect([...titlesUpperCase].sort()).toEqual([...titlesLowerCase].sort());
  });
});
