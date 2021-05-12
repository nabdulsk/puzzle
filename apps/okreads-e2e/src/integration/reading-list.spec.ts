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

  it('Then: I should be able to mark a book as finished', () => {
    cy.get('tmo-root').should('contain.text', 'okreads');

    cy.get('#searchInput').type('jquery');
    cy.get('form').submit();

    cy.get('[data-testing="book-item"]')
      .find('button:not(:disabled)')
      .its('length')
      .should('be.gt', 0)
      .then(() => {
        cy.get('button[id^="wantToRead-"]:not(:disabled)')
          .invoke('attr', 'id')
          .then(id => {
            const bookId = id.split(/-(.+)/)[1];

            cy.get(`#wantToRead-${bookId}`).click();

            cy.get('[data-testing="toggle-reading-list"]').click();
            cy.get('[data-testing="reading-list-container"]')
              .should(
                'contain.text',
                'My Reading List'
              );

            cy.get(`#markAsRead-${bookId}`)
              .click()
              .then(() => {
                cy.get(`#markAsRead-${bookId}`)
                  .should('be.disabled');
              });

            cy.get(`#btnToggleListClose`).click();

            cy.get(`#wantToRead-${bookId}`)
              .should('be.disabled')
              .should('include.text', 'Finished');
          });
      });
  });
});
