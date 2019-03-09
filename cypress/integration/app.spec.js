describe('Log in', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3300/');
  });

  it('shows the correct buttons', () => {
    cy.get('button').should('have.length', 3);
  });
});
