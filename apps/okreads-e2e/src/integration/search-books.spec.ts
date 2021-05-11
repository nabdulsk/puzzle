describe('When: Use the search feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should be able to search books by title', () => {
    cy.get('input[type="search"]').type('javascript');

    cy.get('form').submit();

    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
  });

  it('Then: I should see search results as I am typing', () => {
    cy.get('tmo-root').should('contain.text', 'okreads');
    cy.get('#searchInput').type('nodejs');
    cy.get('[data-testing="book-item"]').its('length').should('be.gt', 1);
  });

  it('Then: I should see error message with no data', () => {
    const errorMsg = 'Books are not available with the given search input';
    cy.get('tmo-root').should('contain.text', 'okreads');
    cy.get('#searchInput').type('#');
    cy.get('#errorMsg').should('contain.text', errorMsg);
  });
});
