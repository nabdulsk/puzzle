describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should add book back to reading list which was removed, on undo snackbar action', () => {
    cy.get('tmo-root').should('contain.text', 'okreads');

    cy.get('#searchInput').type('python');
    cy.get('form').submit();

    cy.get('[data-testing="book-item"]')
      .find('button:not(:disabled)')
      .its('length')
      .should('be.gt', 0)
      .then(() => {
        cy.get('button[id^="wantToRead-"]:not(:disabled)').first().click();

        cy.get('[data-testing="toggle-reading-list"]').click();
        cy.get('[data-testing="reading-list-container"]')
          .should(
            'contain.text',
            'My Reading List'
          );

        cy.get('button[id^="btnRemove-"]').first().click();
        cy.get('.mat-simple-snackbar-action .mat-button').last().click();

        cy.get('[data-testing="reading-list-container"]')
          .find('.reading-list-item')
          .its('length')
          .should('be.gt', 0)
      });
  });
});
