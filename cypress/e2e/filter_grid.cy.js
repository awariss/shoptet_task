describe('Filter - product grid test', () => {

  // Selectors for filter checkboxes
  const stocksCheckbox = 'input[data-filter-code="stock"]';
  const actionCheckbox = 'input[data-filter-id="1"][name="dd[]"]';
  const newCheckbox = 'input[data-filter-id="2"][name="dd[]"]';
  const tipCheckbox = 'input[data-filter-id="3"][name="dd[]"]';
  const productCountFromFilter = '#param-filter-right .show-filter-button strong';

  // Selector for product items
  const productItem = 'li[data-testid="productItem"]';

  // Selectors for product attributes
  const availabilityText = 'span[class="p-cat-availability"]';
  const actionLabel = 'span[class="bool-icon-single bool-action"]';
  const newLabel = 'span[class="bool-icon-single bool-new"]';
  const tipLabel = 'span[class="bool-icon-single bool-tip"]';

  // Helper function to count the number of product items displayed
  function getProductCount() {
    return cy.get(productItem).then(($elements) => $elements.length);
  }

  // Helper function to get the product count displayed in the filter summary
  function getProductCountFromFilter() {
    return cy.get(productCountFromFilter)
        .invoke('text') // Extract text content
        .then((text) => parseInt(text.trim(), 10)); // Parse text as an integer
  }

  // Before each test, navigate to the category page
  beforeEach(() => {
    cy.visit('https://pop.shoptet.cz/obleceni/');
  });

  // Test for "Stock" checkbox filter
  it('check stock checkbox', () => {
    cy.intercept('GET', '?stock=1').as('getFilter'); // Mock GET request for stock filter

    cy.get(stocksCheckbox).click(); // Click on the stock filter checkbox
    cy.wait('@getFilter').its('response.statusCode').should('eq', 200); // Verify the request succeeds
    cy.get(productItem).each(($product) => {
      cy.wrap($product).find(availabilityText).should('exist'); // Ensure products display availability text
    });

    getProductCount().then((productCount) => {
      getProductCountFromFilter().then((displayedCount) => {
        expect(productCount).to.eq(displayedCount); // Compare counts from UI and filter summary
      });
    });
  });

  // Test for "Action" checkbox filter
  it('check dd checkbox', () => {
    cy.intercept('GET', '?dd=1').as('getFilter'); // Mock GET request for "dd" filter

    cy.get(actionCheckbox).click(); // Click on the "Action" filter checkbox
    cy.wait('@getFilter').its('response.statusCode').should('eq', 200); // Verify the request succeeds
    cy.get(productItem).each(($product) => {
      cy.wrap($product).find(actionLabel).should('exist'); // Ensure products have action label
    });

    getProductCount().then((productCount) => {
      getProductCountFromFilter().then((displayedCount) => {
        expect(productCount).to.eq(displayedCount); // Compare counts from UI and filter summary
      });
    });
  });

  // Test for "New" and "Tip" checkboxes together
  it('check more dd checkboxs', () => {
    cy.intercept('GET', '?dd=2,3').as('getFilter'); // Mock GET request for combined filters
    cy.get(newCheckbox).click(); // Click on the "New" filter checkbox
    cy.get(tipCheckbox).click(); // Click on the "Tip" filter checkbox

    cy.wait('@getFilter').its('response.statusCode').should('eq', 200); // Verify the request succeeds
    cy.get(productItem).each(($product) => {
      cy.wrap($product).find(newLabel).should('exist'); // Ensure products have "New" label
      cy.wrap($product).find(tipLabel).should('exist'); // Ensure products have "Tip" label
    });

    getProductCount().then((productCount) => {
      getProductCountFromFilter().then((displayedCount) => {
        expect(productCount).to.eq(displayedCount); // Compare counts from UI and filter summary
      });
    });
  });

});
