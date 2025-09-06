/// <reference types="cypress" />

describe('Purchase Flow', () => {
  it('should complete the purchase flow with shipping information', () => {
    cy.visit('https://sent-io.site', { timeout: 30000 });
    cy.get('.grid > .text-center > .flex > a > .inline-flex', { timeout: 10000 }).click();
    cy.get('.px-8', { timeout: 10000 }).click();
    cy.get('.space-y-4 > .grid > :nth-child(1) > .w-full', { timeout: 10000 }).type('John'); 
    cy.get('.grid > :nth-child(2) > .w-full', { timeout: 10000 }).type('Doe');
    cy.get('.space-y-4 > :nth-child(2) > .w-full', { timeout: 10000 }).type('john.doe@example.com'); 
    cy.get('.space-y-4 > :nth-child(3) > .w-full', { timeout: 10000 }).type('1234567890');
    cy.get(':nth-child(4) > .w-full', { timeout: 10000 }).type('102 Route de la Pyramide, Paris, France');
   
    cy.get('.pac-container', { timeout: 15000 }).should('be.visible')
      .find('.pac-item')
      .first()
      .click();

    cy.get('.px-6', { timeout: 10000 }).click();
    
    // Longer timeout for Stripe redirect
    cy.url({ timeout: 30000 }).should('include', 'checkout.stripe.com');
  });
});