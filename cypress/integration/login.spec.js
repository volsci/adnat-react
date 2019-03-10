describe('Log in', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3300/');
  });

  it('shows the correct buttons', () => {
    cy.get('button').should('have.length', 3);
    cy.get(':nth-child(2) > .MuiButtonBase-root-218 > .MuiButton-label-258')
      .contains('Forgot Password');
    cy.get('.MuiCardActions-disableActionSpacing-135 > .MuiButtonBase-root-218 > .MuiButton-label-258')
      .contains('Log In');
    cy.get('.LogIn-signUp-7 > .MuiButton-label-258')
      .contains('Don\'t have an account yet? Sign Up')
  });

  it('shows the email field', () => {
    cy.get('#outlined-email-input').should('have.length', 1)
      .should('have.attr', 'name', 'email');
  });

  it('shows the password field', () => {
    cy.get('#outlined-password-input').should('have.length', 1)
      .should('have.attr', 'type', 'password');
  });

  it('has a working remember me switch', () => {
    cy.get(':nth-child(3) > .MuiGrid-container-9 > :nth-child(1)').should('have.length', 1)
      .contains('Remember Me');

    cy.get('.MuiFormGroup-root-191')
      .click()
  });

  it('has a working forgot password button', () => {
    cy.get(':nth-child(2) > .MuiButtonBase-root-218 > .MuiButton-label-258')
      .click()
      .location('pathname').should('eq', '/forgotpass')
  });

  it('has a working sign up button', () => {
    cy.get('.LogIn-signUp-7 > .MuiButton-label-258')
      .click()
      .location('pathname').should('eq', '/signup')
  });

  it('catches invalid emails', () => {
    cy.get('#outlined-email-input')
      .type('foo');

    cy.get('#outlined-password-input')
      .type('foo');

    cy.get('.MuiCardActions-disableActionSpacing-135')
      .click();

    cy.get('.MuiSnackbar-root-283 > .MuiTypography-root-221')
      .should('have.length', 1);
  });

  it('catches empty strings', () => {
    cy.get('.MuiCardActions-disableActionSpacing-135')
      .click();

    cy.get('.MuiSnackbar-root-283 > .MuiTypography-root-221')
      .should('have.length', 1);
  });
});

