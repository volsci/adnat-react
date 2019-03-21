describe('Forgot Password', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3300/forgotpass');
  });

  it('shows the correct buttons', () => {
    cy.get('button').should('have.length', 2);
    cy.get('.MuiPaper-root-107 > :nth-child(2)')
      .contains('Send Me A Reset Password Link');
    cy.get('.MuiPaper-root-107 > :nth-child(3)')
      .contains('Back');
  });

  it('shows the email field', () => {
    cy.get('#outlined-email-input').should('have.length', 1)
      .should('have.attr', 'name', 'email');
  });

  it('catches invalid emails', () => {
    cy.get('#outlined-email-input')
      .type('foo');

    cy.get('.MuiPaper-root-107 > :nth-child(2)')
      .click();

    cy.get('.MuiTypography-root-237')
      .should('have.length', 1);
  });

  it('catches empty strings', () => {
    cy.get('.MuiPaper-root-107 > :nth-child(2)')
      .click();

    cy.get('.MuiTypography-root-237')
      .should('have.length', 1);
  });

  it('has a working back button', () => {
    cy.get('.MuiPaper-root-107 > :nth-child(3)')
      .click()
      .location('pathname').should('eq', '/')
  });
});

