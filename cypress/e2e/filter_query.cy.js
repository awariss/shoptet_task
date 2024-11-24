// Selector for "Stock" filter checkbox
const stocksCheckbox = 'input[data-filter-code="stock"]';

// Filters for "Action," "New," and "Tip"
const filterCheckboxes = [
  { name: 'Action', id: '1', testId: 'input[data-filter-id="1"][name="dd[]"]' },
  { name: 'New', id: '2', testId: 'input[data-filter-id="2"][name="dd[]"]' },
  { name: 'Tip', id: '3', testId: 'input[data-filter-id="3"][name="dd[]"]' }
];

describe('Filter - query test', () => {
  // Navigate to the product page before each test
  beforeEach(() => {
    cy.visit('https://pop.shoptet.cz/obleceni/');
  });

  // Test each filter dynamically
  filterCheckboxes.forEach((checkbox) => {
    it(`check ${checkbox.name} checkbox`, () => {
      cy.intercept('GET', `*?dd=${checkbox.id}`).as('getFilter'); // Intercept request
      cy.get(checkbox.testId).click(); // Click filter checkbox
      cy.wait('@getFilter').its('response.statusCode').should('eq', 200); // Verify request
      cy.url().should('include', `?dd=${checkbox.id}`); // Verify URL
    });
  });

  // Test "Stock" filter
  it('check Stock checkbox', () => {
    cy.intercept('GET', '*?stock=1').as('getFilter');
    cy.get(stocksCheckbox).click(); // Click "Stock" checkbox
    cy.wait('@getFilter').its('response.statusCode').should('eq', 200); // Verify request
    cy.url().should('include', '?stock=1'); // Verify URL
  });

  // Test combined "New" and "Tip" filters
  it('check more dd checkboxes', () => {
    const testCheckbox1= filterCheckboxes[1];
    const testCheckbox2 = filterCheckboxes[2];
    cy.intercept('GET', `*?dd=${testCheckbox2.id},${testCheckbox1.id}`).as('getFilter');
    cy.get(testCheckbox2.testId).click(); // Click "Tip"
    cy.get(testCheckbox1.testId).click(); // Click "New"
    cy.wait('@getFilter').its('response.statusCode').should('eq', 200); // Verify request
    cy.url().should('match', new RegExp(`\\?dd=${testCheckbox2.id},${testCheckbox1.id}`)); // Verify URL
  });
});
