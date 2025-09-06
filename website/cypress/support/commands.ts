// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

export { };

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): void;
    }
  }
}

Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('https://sent-io.site/admin');
  cy.get('input[name="email"]').type('admin@iot.com', { log: false });
  cy.get('input[name="password"]').type('test1234', { log: false });
  cy.get('button[type="submit"]').click();
  cy.wait(1000);
  cy.visit('https://sent-io.site/admin');
  // cy.url().should('include', '/admin/');
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })