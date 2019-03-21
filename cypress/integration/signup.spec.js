describe('Sign Up', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3300/signup');
  });

  it('shows the correct buttons', () => {
    cy.get('button').should('have.length', 2);
    cy.get('.MuiPaper-root-107 > :nth-child(5)')
      .contains('Sign Up');
    cy.get('.MuiPaper-root-107 > :nth-child(6)')
      .contains('Back');
  });

  it('shows the name field', () => {
    cy.get('#outlined-name').should('have.length', 1)
      .should('have.attr', 'type', 'text');
  });

  it('shows the email field', () => {
    cy.get('#outlined-email-input').should('have.length', 1)
      .should('have.attr', 'name', 'email');
  });

  it('shows the password field', () => {
    cy.get('#outlined-password-input').should('have.length', 1)
      .should('have.attr', 'type', 'password');
  });

  it('shows the password confirmation field', () => {
    cy.get('#outlined-passwordConfirmation-input').should('have.length', 1)
      .should('have.attr', 'type', 'password');
  });

  it('has a working back button', () => {
    cy.get('.MuiPaper-root-107 > :nth-child(6)')
      .click()
      .location('pathname').should('eq', '/')
  });

  it('catches invalid emails', () => {
    cy.get('#outlined-name')
      .type('foo');

    cy.get('#outlined-email-input')
      .type('foo');

    cy.get('#outlined-password-input')
      .type('foo');

    cy.get('#outlined-passwordConfirmation-input')
      .type('foo');

    cy.get('.MuiPaper-root-107 > :nth-child(5)')
      .click();

    cy.get('.MuiTypography-root-237')
      .should('have.length', 1);
  });

  it('catches short passwords', () => {
    cy.get('#outlined-name')
      .type('foo');

    cy.get('#outlined-email-input')
      .type('foo@');

    cy.get('#outlined-password-input')
      .type('foo');

    cy.get('#outlined-passwordConfirmation-input')
      .type('foo');

    cy.get('.MuiPaper-root-107 > :nth-child(5)')
      .click();

    cy.get('.MuiTypography-root-237')
      .should('have.length', 1);
  });

  it('catches empty strings', () => {
    cy.get('.MuiPaper-root-107 > :nth-child(5)')
      .click();

    cy.get('.MuiTypography-root-237')
      .should('have.length', 1);
  });

  it('has a working back button', () => {
    cy.get('.MuiPaper-root-107 > :nth-child(6)')
      .click()
      .location('pathname').should('eq', '/')
  });
});

