describe('Log in', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3300/');
  });

  it('shows the correct buttons', () => {
    cy.get('button').should('have.length', 3);
    cy.get(':nth-child(2) > .MuiButtonBase-root-219')
      .contains('Forgot Password');
    cy.get('.MuiCardActions-disableActionSpacing-136')
      .contains('Log In');
    cy.get('.LogIn-signUp-7')
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
    cy.get('.MuiFormGroup-root-192')
      .contains('Remember Me');

    cy.get('.MuiPrivateSwitchBase-input-212')
      .click()
  });

  it('has a working forgot password button', () => {
    cy.get(':nth-child(2) > .MuiButtonBase-root-219')
      .click()
      .location('pathname').should('eq', '/forgotpass')
  });

  it('has a working sign up button', () => {
    cy.get('.LogIn-signUp-7')
      .click()
      .location('pathname').should('eq', '/signup')
  });

  it('catches invalid emails', () => {
    cy.get('#outlined-email-input')
      .type('foo');

    cy.get('#outlined-password-input')
      .type('foo');

    cy.get('.MuiCardActions-disableActionSpacing-136')
      .click();

    cy.get('.MuiSnackbar-root-284 > .MuiTypography-root-222')
      .should('have.length', 1);
  });

  it('catches empty strings', () => {
    cy.get('.MuiCardActions-disableActionSpacing-136')
      .click();

    cy.get('.MuiSnackbar-root-284 > .MuiTypography-root-222')
      .should('have.length', 1);
  });
});

