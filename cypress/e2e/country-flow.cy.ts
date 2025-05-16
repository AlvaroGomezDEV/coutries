describe('Basic flow: search, navigate, favorite', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should search, navigate to detail and toggle favorite', () => {
    const searchTerm = 'Colombia';
    const cca3 = 'COL';

    cy.get('[data-testid="search-input"]').type(searchTerm);

    cy.wait(500);

    cy.contains(searchTerm).click();

    cy.url().should('include', '/country/'+cca3);

    cy.get('[data-testid="favorite-button"]').click();

    cy.get('[data-testid="favorited"]').should('contain.text', 'favorite');

    cy.get('[data-testid="favorite-button"]').click();

    cy.get('[data-testid="not-favorited"]').should('contain.text', 'favorite_border');

    cy.go('back');

    cy.url().should('eq', Cypress.config().baseUrl + '/countries');
  });
});